const express = require("express")
const cloudinary = require("cloudinary").v2
const app = express()
const env = require("dotenv")
const cors = require("cors")
const posts = require("./routes/posts")
const users = require("./routes/users")
const connectdb = require("./utils/connectdb")
const session = require("express-session")
const passport = require("passport")
const cron = require("node-cron")
const postModel = require("./models/post") // Importez le modèle de post
const { isAuthenticatedAndAdmin } = require("./middleware/isAdmin")

env.config({ path: "./config/.env" })

connectdb()
app.set("trust proxy", 1)
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: true,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true, // remmetre ça en true en production
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      httpOnly: true,
    },
  })
)

app.use(passport.initialize()) // initialize passport
app.use(passport.session()) // use the cookie to store the session

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://kherdja.com",
      "http://kherdja.com",
      "www.kherdja.com",
      "https://kherdja.netlify.app",
      "https://kherdja-backend.onrender.com",
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
)

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use(express.json({ limit: "15mb" }))

app.use("/api/isAuthenticated", async (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).send(req.user)
  } else {
    return res.status(400).send("utilisateur non connecter")
  }
})

// mount the routes
app.use("/api/posts", posts)
app.use("/api/users", users)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("app running on port " + PORT)

  // Planifiez l'exécution de la fonction de nettoyage chaque jour à minuit
  cron.schedule("0 0 * * *", async () => {
    try {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      // Supprimez les posts de la base de données
      await postModel.deleteMany({ createdAt: { $lt: sixMonthsAgo } })
      console.log(
        "Les posts plus vieux que 6 mois ont été supprimés avec succès."
      )
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression des posts plus vieux que 6 mois:",
        error
      )
    }
  })
})
