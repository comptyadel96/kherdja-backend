const tryCatchHandler = require("../middleware/tryCatchHandler")
const { postModal } = require("../models/post")

// get all posts
exports.getposts = tryCatchHandler(async (req, res, next) => {
  // pagination filtering and sorting
  var sortedBy = req.query.sortBy || "createdAt"
  var order = parseInt(req.query.order) || -1
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const startIndex = (page - 1) * limit

  let postsNumber = await postModal.countDocuments()
  
  const posts = await sweatModel
    .find()
    .skip(startIndex)
    .limit(limit)
    .sort({ [sortedBy]: order })
  // search shirt by title
  if (req.query.search) {
    const posts = await postModal
      .find({
        $or: [{ title: { $regex: req.query.search, $options: "i" } }],
      })
      .skip(startIndex)
      .limit(limit)
      .sort({ [sortedBy]: order })
    //   .select("title _id tags ")
    return res.status(200).json({
      numbOfPosts: postsNumber,
      posts,
    })
  }

  if (!posts) {
    return res
      .status(404)
      .send("aucun article trouver ... veuillez réessayer plus tard")
  }
  res.status(200).json({
    numbOfPosts: postsNumber,
    posts,
  })
})

// get a single post
exports.getPost = tryCatchHandler(async (req, res, next) => {
  let post = await postModal.findById(req.params.id)
  if (!post) {
    res.status(404).send("aucun post trouver avec cet identificateur")
  }
  return res.status(200).send(post)
})

// create a new post
exports.createPost = tryCatchHandler(async (req, res, next) => {
  // Vérifier si une image a été téléchargée
  if (!req.file) {
    return res.status(400).json({ message: "Veuillez télécharger une image" })
  }

  // Si une image est téléchargée, créer le post avec les données fournies
  const { titre, dateDebut, paragraphe, heureDebut, type, lieu, prix ,photo} =
    req.body
  const post = await postModal.create({
    titre,
    dateDebut,
    paragraphe,
    heureDebut,
    type,
    lieu,
    prix,
    photo: req.file.path, // Chemin de l'image téléchargée
  })

  return res.status(200).json({ message: "Post créé avec succès", post })
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
