const express = require("express")
const router = express.Router()
const {
    register,
    verifyOTP,
    login,
    addAddress
} = require("../controllers/user/auth.user")

const { createOrder } = require("../controllers/user/orders.user")

const { auth } = require('../middlewares/admin/auth')
const { findNearestVendor } = require("../controllers/user/logistic.user")

router.post("/signup", register)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)
router.post("/createOrder", createOrder)
router.put("/addAddress", addAddress)

//logistic
router.get("/findNearestVendor", findNearestVendor)

module.exports = { userRoutes: router }