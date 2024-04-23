const express = require("express")
const router = express.Router()
const {
    credentials
} = require("../../controllers/admin/auth")
const {  } = require('../../middlewares/admin/auth')

router.get("/sendOTP", credentials)
// router.post("/verifyOTP", checkApproval, verifyOTP)
// router.get("/login", checkApproval, login)

module.exports = router; 