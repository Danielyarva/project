import type { Request, Response } from "express"
import { ApiError } from "../middleware/errorHandler.js"
import { ProductModel } from "../models/Product.js"
import { ReviewModel } from "../models/Review.js"

async function recomputeProductRating(productId: unknown): Promise<void> {
  const [stats] = await ReviewModel.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avgRating: { $avg: "$rating" }, numReviews: { $sum: 1 } } },
  ])

  await ProductModel.findByIdAndUpdate(productId, {
    avgRating: stats ? Math.round(stats.avgRating * 10) / 10 : 0,
    numReviews: stats?.numReviews ?? 0,
  })
}

export async function listReviews(req: Request, res: Response) {
  const product = await ProductModel.findOne({ slug: req.params.slug }).select("_id")
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  const reviews = await ReviewModel.find({ product: product._id })
    .populate("user", "name")
    .sort({ createdAt: -1 })

  res.json({ reviews })
}

export async function createReview(req: Request, res: Response) {
  const product = await ProductModel.findOne({ slug: req.params.slug }).select("_id")
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  const existing = await ReviewModel.findOne({ product: product._id, user: req.user!.id })
  if (existing) {
    throw new ApiError(409, "You have already reviewed this product")
  }

  const review = await ReviewModel.create({
    product: product._id,
    user: req.user!.id,
    rating: req.body.rating,
    comment: req.body.comment,
  })
  await recomputeProductRating(product._id)

  const populated = await review.populate("user", "name")
  res.status(201).json({ review: populated })
}
