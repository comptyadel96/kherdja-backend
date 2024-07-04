const tryCatchHandler = require("../middleware/tryCatchHandler")
const { postModal } = require("../models/post")
const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// get all posts
exports.getposts = tryCatchHandler(async (req, res, next) => {
  var sortedBy = req.query.sortBy || "createdAt"
  var order = parseInt(req.query.order) || -1
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const startIndex = (page - 1) * limit
  const type = req.query.type || null

  let query = {}

  if (type) {
    query.type = type
  }

  let postsNumber = await postModal.countDocuments(query)
  const posts = await postModal
    .find(query)
    .skip(startIndex)
    .limit(limit)
    .sort({ [sortedBy]: order })

  if (req.query.search) {
    const posts = await postModal
      .find({
        $or: [{ titre: { $regex: req.query.search, $options: "i" } }],
      })
      .skip(startIndex)
      .limit(limit)
      .sort({ [sortedBy]: order })
      .select("titre photo _id ")
    return res.status(200).json({
      numbOfPosts: postsNumber,
      posts,
    })
  }

  if (posts.length === 0) {
    return res
      .status(404)
      .send("Aucun article trouvé... Veuillez réessayer plus tard")
  }
  res.status(200).json({
    numbOfPosts: postsNumber,
    posts,
  })
})

exports.getaLaUne = tryCatchHandler(async (req, res, next) => {
  const posts = await postModal.find({ aLaUne: true }).limit(10)
  return res.status(200).send(posts)
})

// get a single post
exports.getPost = tryCatchHandler(async (req, res, next) => {
  let post = await postModal.findOne({ _id: req.params.id })
  if (!post) {
    return res
      .status(404)
      .send("aucun post trouver avec cet identificateur" + req.query.id)
  }
  return res.status(200).send(post)
})

// create a new post
exports.createPost = tryCatchHandler(async (req, res, next) => {
  const {
    titre,
    dateDebut,
    paragraphe,
    heureDebut,
    type,
    lieu,
    prix,
    organisateur,
    aLaUne,
  } = req.body

  const post = await postModal.create({
    titre,
    dateDebut,
    paragraphe,
    heureDebut,
    type,
    lieu,
    prix,
    photo: req.body.photo,
    images: req.body.images,
    videos: req.body.videos,
    organisateur,
    aLaUne,
  })

  // const result = await cloudinary.uploader.upload(req.file.path, {
  //   folder: "kherdja",
  // })
  // console.log(result.url)

  console.log(req.user)
  return res.status(200).json({ message: "Post créé avec succès", post })
})

// edit post
exports.editPost = tryCatchHandler(async (req, res, next) => {
  const updateData = req.body
  const postId = req.params.id

  // Récupérer l'article existant
  let post = await postModal.findById(postId)
  if (!post) {
    return res.status(404).send("Aucun post trouvé avec cet identificateur")
  }

  // Supprimer l'ancienne image si une nouvelle image est fournie
  if (req.body.photo && post.photo !== req.body.photo) {
    const publicId = post.photo.split("/").pop().split(".")[0]
    await cloudinary.uploader.destroy(publicId)
    updateData.photo = req.body.photo
  }

  // Supprimer les anciennes images si de nouvelles images sont fournies
  if (req.body.images) {
    post.images.forEach(async (image) => {
      const publicId = image.split("/").pop().split(".")[0]
      await cloudinary.uploader.destroy(publicId)
    })
    updateData.images = req.body.images
  }

  // Mise à jour de l'article
  post = await postModal.findByIdAndUpdate(postId, updateData, {
    runValidators: true,
    new: true,
  })

  return res.status(200).send(post)
})

// delete post
exports.deletePost = tryCatchHandler(async (req, res, next) => {
  let post = await postModal.findByIdAndDelete(req.params.id)
  if (!post) {
    return res.status(404).send("Aucun post trouvé avec cet identificateur")
  }

  // Supprimer les images associéeg

  if (post.photo) {
    const publicId = post.photo.split("/").pop().split(".")[0]
    await cloudinary.uploader.destroy(publicId)
  }

  post.images.forEach(async (image) => {
    const publicId = image.split("/").pop().split(".")[0]
    await cloudinary.uploader.destroy(publicId)
  })

  return res.status(200).send("Post supprimé avec succès")
})

exports.deletePhoto = tryCatchHandler(async (req, res, next) => {
  const { photo, postId } = req.body
  const tof = photo.split("/").pop().split(".")[0]
  console.log(tof)
  await cloudinary.uploader.destroy(
    "uploads/" + tof,
    { invalidate: true },
    (error, result) => {
      console.log(result, error)
    }
  )
  // Mettre à jour le document dans MongoDB
  const post = await postModal.findById(postId)
  if (!post) {
    return res.status(404).send("Post non trouvé")
  }

  // Filtrer les images pour supprimer l'URL correspondante
  post.images = post.images.filter((imgUrl) => imgUrl !== photo)
  await post.save()

  return res.status(200).send("photo supprimer avec succées")
})
