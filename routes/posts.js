const express = require("express")
const router = express.Router()
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const path = require("path")
const fs = require("fs")

const {
  getposts,
  getPost,
  createPost,
  editPost,
  deletePost,
} = require("../controllers/posts")

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configuration du stockage local pour multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueSuffix + ext)
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 55000000, // 55mb
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/i)) {
      return cb(
        new Error(
          "Le type de fichier doit être une image ou une vidéo de taille inférieure ou égale à 55MB"
        )
      )
    }
    cb(null, true)
  },
})

const uploadFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 8 },
])

// Middleware pour uploader les fichiers vers Cloudinary et récupérer leurs URLs
// Middleware pour uploader les fichiers vers Cloudinary et récupérer leurs URLs
// Middleware pour uploader les fichiers vers Cloudinary et récupérer leurs URLs
const handleUploads = async (req, res, next) => {
  try {
    const uploadToCloudinary = async (filePath, resourceType) => {
      console.log(`Uploading file: ${filePath}`)
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: resourceType,
        folder: "uploads",
      })
      console.log(`Uploaded file: ${result.secure_url}`)
      fs.unlinkSync(filePath) // Supprimez le fichier local après l'upload
      return result.secure_url
    }

    if (req.files.photo) {
      req.body.photo = await uploadToCloudinary(req.files.photo[0].path, "image")
      fs.unlinkSync(req.files.photo[0].path) // Supprimez le fichier local
    }
    if (req.files.images) {
      req.body.images = await Promise.all(
        req.files.images.map(async (file) => {
          const imageUrl = await uploadToCloudinary(file.path, "image")
          fs.unlinkSync(file.path) // Supprimez le fichier local
          return imageUrl
        })
      )
    }
    if (req.files.videos) {
      req.body.videos = await Promise.all(
        req.files.videos.map(async (file) => {
          const videoUrl = await uploadToCloudinary(file.path, "video")
          fs.unlinkSync(file.path) // Supprimez le fichier local
          return videoUrl
        })
      )
    }
    next()
  } catch (error) {
    console.error("Error in handleUploads:", error)
    return next(error)
  }
}

router.route("/").get(getposts).post(uploadFields, handleUploads, createPost)

router
  .route("/:id")
  .get(getPost)
  .put(uploadFields, handleUploads, editPost)
  .delete(deletePost)

module.exports = router