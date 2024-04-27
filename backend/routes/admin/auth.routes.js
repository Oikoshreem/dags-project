const express = require("express")
const router = express.Router()
const {
    credentials,
    verifyOTP,
    twoSV
} = require("../../controllers/admin/auth.admin")
const { logIP, auth } = require('../../middlewares/admin/auth')

router.post("/credintials", logIP, credentials)
router.post("/verifyOTP", logIP, verifyOTP)
router.post("/twoSV", logIP, auth, twoSV)
// router.post("/verifyOTP", checkApproval, verifyOTP)
// router.get("/login", checkApproval, login)

module.exports = { admin_authRoutes: router }; 