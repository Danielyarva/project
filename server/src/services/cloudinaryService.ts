import { cloudinary } from "../config/cloudinary.js"

const PRODUCT_IMAGE_FOLDER = "mortar-pestle/products"

export function uploadProductImage(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: PRODUCT_IMAGE_FOLDER, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"))
          return
        }
        resolve(result.secure_url)
      },
    )
    stream.end(buffer)
  })
}

export function uploadProductImages(buffers: Buffer[]): Promise<string[]> {
  return Promise.all(buffers.map(uploadProductImage))
}
