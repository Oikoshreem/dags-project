const express = require("express")
const router = express.Router()
const {
    register,
    verifyOTP,
    login,
    trackLocation
} = require("../controllers/logistic/auth.logistic")
// const { auth } = require('../../middlewares/admin/auth')

router.post("/signup", register)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)
router.post("/trackLoaction", trackLocation)

module.exports = { logisticRoutes: router }; 