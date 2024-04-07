const express = require("express")
const app = express()
const env = require("dotenv")
const cors = require("cors")
const posts = require("./routes/posts")
const connectdb = require("./utils/connectdb")

env.config()

connectdb()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
)
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173")

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  )

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true)

  // Pass to next layer of middleware
  next()
})

// serve static images
app.use(express.static(__dirname + "/public"))
app.use(express.json({ limit: "15mb" }))
// mount the routes

app.use("/api/posts", posts)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log("app running on port " + PORT))
