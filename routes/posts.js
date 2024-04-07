const router = require("express").Router()
const multer = require("multer")
const path = require("path")
const {
  getposts,
  getPost,
  createPost,
  editPost,
  deletePost,
} = require("../controllers/posts")

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

router.route("/").get(getposts).post(upload, createPost)

router.route("/:id").get(getPost).put(upload, editPost).delete(deletePost)

module.exports = router
