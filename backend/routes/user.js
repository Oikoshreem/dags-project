const express = require("express")
const router = express.Router()
const {
    register,
    verifyOTP,
    login
} = require("../controllers/user/auth.user")

const { createOrder } = require("../controllers/user/orders.user")

const { auth } = require('../middlewares/admin/auth')

router.post("/signup", register)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)
router.post("/createOrder", createOrder)

module.exports = { userRoutes: router }