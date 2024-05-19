const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
  {
    photo: String,
    dateDebut: {
      type: String,
      // maxLenght: [8, "la date de début ne doit pas dépasser 8 caractéres"],
      // minlength: [8, "la date de début doit comporter au moins 8 caractéres"],
    },
    heureDebut: String,
    lieu: String,
    prix: String,
    type: {
      type: String,
      enum: [
        "News",
        "Poeple",
        "Concert et musique",
        "Cinéma et séries Tv",
        "Spectacle et humour",
        "Théâtre",
        "Musées et expositions",
        "Ou manger",
        "Restaurant",
        "Street Food",
        "Brunch et Café",
        "Pâtisseries et gâteaux",
        "Tendance Food",
        "Sport et bien-être",
        "Plages et piscines",
        "Foires et salons",
        "Shopping et mode",
        "Gaming",
        "Hôtels",
        "Maisons d'hôtes",
        "Excursions",
        "Famille et Kids",
        "Bons plans",
      ],
    },
    titre: String,
    paragraphe: String,
    organisateur: String,
    images: [String],
    videos: [String],
  },
  { timestamps: true }
)

// Schema indexes
postSchema.index({ titre: "text" })

const postModal = mongoose.model("Post", postSchema)
module.exports = { postModal }
