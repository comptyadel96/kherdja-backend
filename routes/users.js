const { getusers, register, login, logout } = require("../controllers/users")
const router = require("express").Router()

router.route("/").get(getusers).post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)


module.exports = router