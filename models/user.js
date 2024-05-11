const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      minLength: [4, "le nom doit doit contenir au-moins 4 lettres"],
      maxLength: [200, "le nom ne doit pas dépasser 200 lettres"],
      required: [true, "veuillez entrer le nom de famille svp"],
    },
    prenom: {
      type: String,
      minLength: [4, "le prenom doit doit contenir au-moins 4 lettres"],
      maxLength: [200, "le prenom ne doit pas dépasser 200 lettres"],
      required: [true, "veuillez entrer le prenom "],
    },
    email: {
      type: String,
      minLength: [10, "le nom doit doit contenir au-moins 4 lettres"],
      maxLength: [200, "l'email ne doit pas dépasser 200 lettres/chiffres"],
    },
    password: String,
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Référence au modèlez de schéma des posts
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)
const userModel = mongoose.model("User", userSchema)
module.exports = { userModel }
