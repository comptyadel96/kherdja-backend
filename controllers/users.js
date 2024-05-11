const tryCatchHandler = require("../middleware/tryCatchHandler")
const { userModel } = require("../models/user")
const bcrypt = require("bcrypt")
const saltRounds = 10
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

// serialize(from json data to a serie of strings) and deserialize user(from a serie of strings to a json data)
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  userModel.findById(id).then((user) => {
    done(null, user)
  })
})

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      // passReqToCallback: true,
    },
    async (username, password, done) => {
      const currUser = await userModel.findOne({ email: username })

      if (!currUser) {
        return done(null, false, {
          message: "Aucun utilisateur enregistrer avec cet email",
        })
      }

      // Vérifier le mot de passe
      bcrypt.compare(password, currUser.password, (err, isMatch) => {
        if (err) {
          return done(err)
        }
        if (isMatch) {
          return done(null, currUser)
        } else {
          return done(null, false, {
            message: "Nom d'utilisateur ou mot de passe incorrecte",
          })
        }
      })
    }
  )
)

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//       // passReqToCallback: true,
//     },
//     async (username, password, done) => {
//       try {
//         const currUser = await userModel.findOne({ email: username })

//         if (!currUser) {
//           return done(null, false, {
//             message: "Aucun utilisateur enregistré avec cet email",
//           })
//         }

//         // Utilisation de bcrypt.compare de manière asynchrone
//         const isMatch = await bcrypt.compare(password, currUser.password)
//         if (isMatch) {
//           return done(null, currUser)
//         } else {
//           return done(null, false, {
//             message: "Nom d'utilisateur ou mot de passe incorrect",
//           })
//         }
//       } catch (error) {
//         return done(error)
//       }
//     }
//   )
// )

exports.getusers = tryCatchHandler(async (req, res, next) => {
  const userNumb = await userModel.countDocuments()

  const allUsers = await userModel.find()
  res.json({ numberDocument: userNumb, allUsers })
})

//  get single user
exports.getUser = tryCatchHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.query.id)
    .populate("likedPosts", "_id photo titre")

  if (!user) {
    return res
      .status(404)
      .send("Aucun utilisatezur trouver avec cet Id " + req.params.id)
  }
})

// Register new user
exports.register = tryCatchHandler(async (req, res, next) => {
  const { nom, prenom, email, hasCompletedProfile, authProvider, password } =
    req.body
  bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
    if (err) {
      console.error("Erreur lors du hashage du mot de passe :", err)
    }

    const newUser = await userModel.create({
      nom,
      prenom,
      email,
      hasCompletedProfile,
      authProvider,
      password: hashedPassword,
    })
    // Remplir userId avec _id lors de la création
    newUser.userId = newUser._id.toString()
    await newUser.save().then(() => {
      req.logIn(newUser, (err) => {
        if (err) {
          throw err
        }
      })
      res.status(200).send(newUser)
    })
  })
})

// login
exports.login = tryCatchHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res
        .status(400)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrecte" })
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      res.status(200).send(user)
    })
  })(req, res, next)
})

// logout
exports.logout = tryCatchHandler(async (req, res, next) => {
  res.clearCookie("connect.sid")
  req.logOut(() => {
    req.session.destroy(function (err) {
      // destroys the session
      res.send()
    })
  })
})
