const mongoose = require("mongoose")

module.exports = connectDatabase = async () => {
  await mongoose.connect(process.env.mongoURI)
  console.log(`MongoDB Connected`)
}
