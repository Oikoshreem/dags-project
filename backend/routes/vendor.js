const express = require("express")
const router = express.Router()
const {
    register,
    verifyOTP,
    login
} = require("../controllers/vendor/auth.vendor")
const {
    findShortestDistance
} = require("../controllers/vendor/logistic.vendor")
const { auth } = require('../middlewares/admin/auth')

router.post("/signup", register)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)
router.post("/distance", findShortestDistance)

module.exports = { vendorRoutes: router }; 