const { getusers, register, login, logout } = require("../controllers/users")
const router = require("express").Router()

router.route("/").get(getusers).post(register)
router.route("/login").post(login).get(logout)


module.exports = router