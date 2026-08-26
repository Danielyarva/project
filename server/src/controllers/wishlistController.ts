import type { Request, Response } from "express"
import { ApiError } from "../middleware/errorHandler.js"
import { ProductModel } from "../models/Product.js"
import { UserModel } from "../models/User.js"

export async function getWishlist(req: Request, res: Response) {
  const user = await UserModel.findById(req.user!.id).populate("wishlist")
  if (!user) {
    throw new ApiError(401, "User no longer exists")
  }
  res.json({ products: user.wishlist })
}

export async function toggleWishlistItem(req: Request, res: Response) {
  const { productId } = req.params

  const product = await ProductModel.findById(productId)
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  const user = await UserModel.findById(req.user!.id)
  if (!user) {
    throw new ApiError(401, "User no longer exists")
  }

  const index = user.wishlist.findIndex((id) => id.toString() === productId)
  if (index === -1) {
    user.wishlist.push(product._id)
  } else {
    user.wishlist.splice(index, 1)
  }
  await user.save()

  res.json({ wishlist: user.wishlist.map((id) => id.toString()) })
}
