const express = require("express")
const router = express.Router()
const {
    register,
    verifyOTP,
    login
} = require("../../controllers/vendor/auth.vendor")
const { auth } = require('../../middlewares/admin/auth')

router.post("/signup", register)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)

module.exports = { vendor_authRoutes: router }; 