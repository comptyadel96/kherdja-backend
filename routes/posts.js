// // const router = require("express").Router()
// // const multer = require("multer")
// // const path = require("path")
// // const fs = require("fs")
// // const {
// //   getposts,
// //   getPost,
// //   createPost,
// //   editPost,
// //   deletePost,
// // } = require("../controllers/posts")
// // const sharp = require("sharp")

// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, "public/uploads/")
// //   },
// //   filename: function (req, file, cb) {
// //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
// //     const ext = path.extname(file.originalname)
// //     console.log("Extension du fichier:", ext)

// //     cb(null, uniqueSuffix + ext)
// //   },
// // })
// // const upload = multer({
// //   limits: {
// //     fileSize: 55000000, // 55mb
// //   },
// //   fileFilter(req, file, cb) {
// //     if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/gi)) {
// //       return cb(
// //         new Error(
// //           "le type de fichier doit étre une image ou une vidéo de taille inférieure ou égale a 55MBs"
// //         )
// //       )
// //     }
// //     cb(undefined, true)
// //   },
// //   storage: storage,
// // }).fields([
// //   { name: "photo", maxCount: 1 },
// //   { name: "video", maxCount: 1 },
// // ])

// // // upload multiple images for the post

// // const uploads = multer({
// //   limits: {
// //     fileSize: 55000000, // 55mb
// //   },
// //   fileFilter(req, file, cb) {
// //     if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/gi)) {
// //       return cb(
// //         new Error(
// //           "le type de fichier doit étre une image ou une vidéo de taille inférieure ou égale a 55MBs"
// //         )
// //       )
// //     }
// //     cb(undefined, true)
// //   },
// //   storage: storage,
// // }).array("images")

// // // Middleware pour redimensionner l'image avec Sharp
// // const resizeImage = async (req, res, next) => {
  
// //   if (!req.file) {
// //     return next() // Si pas de fichier, passez au middleware suivant
// //   }
// //   try {
// //     const { path: imagePath } = req.file
// //     const resizedImagePath = imagePath.replace(/\.(jpg|jpeg|png)$/gi, ".webp")
// //     await sharp(imagePath)
// //       .resize({ fit: "inside", width: 850, height: 500 })
// //       .toFormat("webp")
// //       .toFile(resizedImagePath)
// //     fs.unlinkSync(imagePath)
// //     req.file.path = resizedImagePath // Mettez à jour le chemin du fichier avec le chemin redimensionné
// //     next()
// //   } catch (error) {
// //     return next(error) // En cas d'erreur, passez à l'erreur suivante
// //   }
// // }

// // router.route("/").get(getposts).post(upload, uploads, resizeImage, createPost)

// // router
// //   .route("/:id")
// //   .get(getPost)
// //   .put(upload, resizeImage, editPost)
// //   .delete(deletePost)

// // module.exports = router


// const express = require("express")
// const router = express.Router()
// const multer = require("multer")
// const path = require("path")
// const fs = require("fs")
// const sharp = require("sharp")

// const {
//   getposts,
//   getPost,
//   createPost,
//   editPost,
//   deletePost,
// } = require("../controllers/posts")

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads/")
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
//     const ext = path.extname(file.originalname)
//     cb(null, uniqueSuffix + ext)
//   },
// })

// const upload = multer({
//   limits: {
//     fileSize: 55000000, // 55mb
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/i)) {
//       return cb(
//         new Error(
//           "Le type de fichier doit être une image ou une vidéo de taille inférieure ou égale à 55MB"
//         )
//       )
//     }
//     cb(null, true)
//   },
//   storage: storage,
// })

// const uploadSingle = upload.single("photo")
// const uploadMultiple = upload.fields([
//   { name: "images", maxCount: 10 },
//   { name: "videos", maxCount: 2 },
// ])

// // Middleware pour redimensionner l'image avec Sharp
// const resizeImage = async (req, res, next) => {
//   if (!req.file) {
//     return next() // Si pas de fichier, passez au middleware suivant
//   }
//   try {
//     const { path: imagePath } = req.file
//     const resizedImagePath = imagePath.replace(/\.(jpg|jpeg|png)$/i, ".webp")
//     await sharp(imagePath)
//       .resize({ fit: "inside", width: 850, height: 500 })
//       .toFormat("webp")
//       .toFile(resizedImagePath)
//     fs.unlinkSync(imagePath)
//     req.file.path = resizedImagePath // Mettez à jour le chemin du fichier avec le chemin redimensionné
//     next()
//   } catch (error) {
//     return next(error) // En cas d'erreur, passez à l'erreur suivante
//   }
// }

// router
//   .route("/")
//   .get(getposts)
//   .post(uploadSingle, uploadMultiple, resizeImage, createPost)

// router
//   .route("/:id")
//   .get(getPost)
//   .put(uploadSingle, resizeImage, editPost)
//   .delete(deletePost)

// module.exports = router





const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const sharp = require("sharp")

const {
  getposts,
  getPost,
  createPost,
  editPost,
  deletePost,
} = require("../controllers/posts")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "/var/data/public/uploads/")
    // cb(null, "public/uploads/")
    cb(null, "/var/data/uploads/")
    // cb(null, path.join(__dirname, "..", "public", "uploads"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueSuffix + ext)
  },
})

const upload = multer({
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
  storage: storage,
})

const uploadFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 8 },
])

// Middleware pour redimensionner les images avec Sharp
const resizeImages = async (req, res, next) => {
  if (!req.files || !req.files.images) {
    return next() // Si pas de fichier, passez au middleware suivant
  }
  try {
    await Promise.all(
      req.files.images.map(async (file) => {
        const resizedImagePath = file.path.replace(
          /\.(jpg|jpeg|png)$/i,
          ".webp"
        )
        await sharp(file.path)
          .resize({ fit: "inside", width: 850, height: 500 })
          .toFormat("webp")
          .toFile(resizedImagePath)
        fs.unlinkSync(file.path)
        file.path = resizedImagePath // Mettez à jour le chemin du fichier avec le chemin redimensionné
      })
    )
    next()
  } catch (error) {
    return next(error) // En cas d'erreur, passez à l'erreur suivante
  }
}

router.route("/").get(getposts).post(uploadFields, resizeImages, createPost)

router
  .route("/:id")
  .get(getPost)
  .put(uploadFields, resizeImages, editPost)
  .delete(deletePost)

module.exports = router
