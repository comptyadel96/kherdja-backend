const express = require("express")
const app = express()
const env = require("dotenv")
const cors = require("cors")
const posts = require("./routes/posts")
const users = require("./routes/users")
const connectdb = require("./utils/connectdb")
const session = require("express-session")
const passport = require("passport")

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
      // sameSite: "none",
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
      "https://kherdja.netlify.app",
      "https://kherdja-backend.onrender.com",
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
)
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", [
//     "http://localhost:5173",
//     "https://kherdja.netlify.app",
//     "https://kherdja-backend.onrender.com",
//     "https://kherdja-backend.onrender.com/api/users/login",
//     "https://kherdja-backend.onrender.com/api/isAuthenticated",
//   ])

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   )

//   // Request headers you wish to allow
//   res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true)

//   // Pass to next layer of middleware
//   next()
// })

// serve static images
app.use(express.static(__dirname + "/public"))
app.use(express.json({ limit: "15mb" }))

app.use("/api/isAuthenticated", async (req, res) => {
  // console.log(req.user)
  // console.log("Session:", req.session)
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

app.listen(PORT, () => console.log("app running on port " + PORT))
