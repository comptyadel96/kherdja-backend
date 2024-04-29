const mongoose = require("mongoose")

const pubSchema = new mongoose.Schema({
  photo: String,
  index: String,
  platforme: String,
})

const pubModal = mongoose.model("Pub", pubSchema)
module.exports = { pubModal }
