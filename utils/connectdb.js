const mongoose = require("mongoose")
// const { env } = require("process")
module.exports = connectDatabase = async () => {
  await mongoose.connect(process.env.mongoURI)
  console.log(`MongoDB Connected`)
}
