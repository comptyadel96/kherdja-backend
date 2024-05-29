const { postModal } = require("../models/post")
const tryCatchHandler = require("../middleware/tryCatchHandler")
const cloudinary = require("cloudinary").v2

// // get all posts
exports.getposts = tryCatchHandler(async (req, res, next) => {
  // pagination filtering and sorting
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

// edit post
exports.editPost = tryCatchHandler(async (req, res, next) => {
  let post = await postModal.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  })
  if (!post) {
    res.status(404).send("aucun post trouver avec cet identificateur")
  }
  return res.status(200).send(post)
})

// delete post
exports.deletePost = tryCatchHandler(async (req, res, next) => {
  let post = await postModal.findByIdAndDelete(req.params.id)
  if (!post) {
    res.status(404).send("aucun post trouver avec cet identificateur")
  }
  return res.status(200).send("post supprimer avec succées")
})

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
  } = req.body

  let photo = null
  let images = []
  let videos = []

  if (req.files.photo) {
    // Télécharger la photo sur Cloudinary
    const result = await cloudinary.uploader.upload(req.files.photo[0].path)
    photo = result.secure_url // Récupérer l'URL sécurisée de l'image
  }
  if (req.files.images) {
    // Télécharger les images sur Cloudinary
    images = await Promise.all(
      req.files.images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path)
        return result.secure_url // Récupérer l'URL sécurisée de l'image
      })
    )
  }
  if (req.files.videos) {
    // Télécharger les vidéos sur Cloudinary
    videos = await Promise.all(
      req.files.videos.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "video",
        })
        return result.secure_url // Récupérer l'URL sécurisée de la vidéo
      })
    )
  }
  const post = await postModal.create({
    titre,
    dateDebut,
    paragraphe,
    heureDebut,
    type,
    lieu,
    prix,
    photo,
    images,
    videos,
    organisateur,
  })

  return res.status(200).json({ message: "Post créé avec succès", post })
})
