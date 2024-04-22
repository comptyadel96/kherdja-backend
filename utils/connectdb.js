const mongoose = require("mongoose")

module.exports = connectdb =  () => {
   mongoose.connect(process.env.mongoURI)
  console.log(`MongoDB Connected`)
}