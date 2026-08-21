import multer from "multer"
import { ApiError } from "./errorHandler.js"

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 6
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_FILES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new ApiError(400, "Only JPEG, PNG, WEBP, or GIF images are allowed"))
      return
    }
    cb(null, true)
  },
})

export const uploadProductImages = upload.array("images", MAX_FILES)
