const mongoose = require("mongoose")

module.exports = connectdb = async () => {
  try {
    mongoose
      .connect(process.env.mongoURI)
      .then((currDb) => console.log("successfully connected to mongoDb"))
  } catch (error) {
    console.log(error)
  }
}
