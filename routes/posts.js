const router = require("express").Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const {
  getposts,
  getPost,
  createPost,
  editPost,
  deletePost,
} = require("../controllers/posts")
const sharp = require("sharp")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    console.log("Extension du fichier:", ext)

    cb(null, uniqueSuffix + ext)
  },
})
const upload = multer({
  limits: {
    fileSize: 55000000, // 55mb
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/gi)) {
      return cb(
        new Error(
          "le type de fichier doit étre une image ou une vidéo de taille inférieure ou égale a 55MBs"
        )
      )
    }
    cb(undefined, true)
  },
  storage: storage,
}).single("photo")

// Middleware pour redimensionner l'image avec Sharp
const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next() // Si pas de fichier, passez au middleware suivant
  }
  try {
    const { path: imagePath } = req.file
    const resizedImagePath = imagePath.replace(/\.(jpg|jpeg|png)$/gi, ".webp")
    await sharp(imagePath)
      .resize({ fit: "inside", width: 450, height: 400 })
      .toFormat("webp")
      .toFile(resizedImagePath)
    fs.unlinkSync(imagePath)
    req.file.path = resizedImagePath // Mettez à jour le chemin du fichier avec le chemin redimensionné
    next()
  } catch (error) {
    return next(error) // En cas d'erreur, passez à l'erreur suivante
  }
}

router.route("/").get(getposts).post(upload, resizeImage, createPost)

router
  .route("/:id")
  .get(getPost)
  .put(upload, resizeImage, editPost)
  .delete(deletePost)

module.exports = router
