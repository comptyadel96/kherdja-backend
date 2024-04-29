const tryCatchHandler = require("../middleware/tryCatchHandler")
const { pubModal } = require("../models/pub")

exports.createPub = tryCatchHandler(async (req, res, next) => {
  const pub = await pubModal.create({
    photo: req.file.path,
  })
})