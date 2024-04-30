const express = require("express")
const router = express.Router()
const {
    register,
    verifyOTP,
    login
} = require("../../controllers/user/auth.user")
const { auth } = require('../../middlewares/admin/auth')

router.post("/signup", register)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)

module.exports = { user_authRoutes: router }; 