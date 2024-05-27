const express = require("express")
const router = express.Router()
const {
    register,
    verifyOTP,
    login,
    fetchProfile,
    updateProfile,
    switchAvailability,
    updateDocs
} = require("../controllers/vendor/auth.vendor")
const {
    findShortestDistance
} = require("../controllers/vendor/logistic.vendor")
const { auth, verifyVendor } = require('../middlewares/vendor/auth')
const { getVendorDashboard, getTodaysOrder, fetchAllOrder, getOrder, acceptOrder, readyForDelivery, activeOrders } = require("../controllers/vendor/order.vendor")

//auth
router.post("/signup", register)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)
router.get("/fetchProfile", auth, verifyVendor, fetchProfile)
router.put("/updateProfile", auth, verifyVendor, updateProfile)
router.put("/updateDocs", auth, updateDocs)
router.post("/switchAvailability", auth, verifyVendor, switchAvailability)

//orders
router.get("/dashboard", auth, verifyVendor, getVendorDashboard)
router.get("/getTodaysOrder", auth, verifyVendor, getTodaysOrder)
router.get("/fetchAllOrder", auth, verifyVendor, fetchAllOrder)
router.get("/getOrder", auth, verifyVendor, getOrder)
router.post("/acceptOrder", auth, verifyVendor, acceptOrder)
router.put("/readyForDelivery", auth, verifyVendor, readyForDelivery)
router.get("/activeOrders", auth, verifyVendor, activeOrders)

// router.post("/distance", findShortestDistance)
module.exports = { vendorRoutes: router }; 