const express = require("express")
const router = express.Router()
const {
    register,
    verifyOTP,
    login,
    addAddress,
    fetchAddress,
    fetchProfile,
    updateUser
} = require("../controllers/user/auth.user")

const { createOrder, fetchServices, verifyPayment, fetchAllOrders, viewItem } = require("../controllers/user/orders.user")

const { auth } = require('../middlewares/user/auth')
const { findNearestVendor, ShortestDistanceForVendor } = require("../controllers/user/logistic.user")
const { giveReview } = require("../controllers/user/vendor.user")

router.post("/signup", register)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)
router.put("/addAddress", auth, addAddress)
router.get("/fetchAddress", auth, fetchAddress)
router.put("/updateUser", auth, updateUser)
router.get("/fetchProfile", auth, fetchProfile)

//orders
router.get("/fetchServices", auth, fetchServices)
router.post("/createOrder", auth, createOrder)
router.post("/verifyPayment", auth, verifyPayment)
router.get("/fetchAllOrders", auth, fetchAllOrders)
router.get("/viewOrder", auth, viewOrder)
router.get("/viewItem", auth, viewItem)

//logistic
router.post("/findNearestVendor", auth, findNearestVendor)
router.post("/ShortestDistanceForVendor", auth, ShortestDistanceForVendor)
router.post("/findNearestVendor", auth, findNearestVendor)

router.post("/findNearestVendor", auth, giveReview)

module.exports = { userRoutes: router }