const express = require("express")
const router = express.Router()
const {
    register,
    verifyOTP,
    login,
    trackLocation,
    updateProfile,
    fetchProfile,
    switchAvailability
} = require("../controllers/logistic/auth.logistic")
const { auth, verifyLogistic } = require("../middlewares/logistic/auth")
const { getLogisticDashboard,
    getAllOrders,
    fetchActiveOrders,
    getOrder,
    pickedUpStatus,
    outOfDeliveryStatus,
    confirmDelivery
} = require("../controllers/logistic/orders.logistic")

//auth
router.post("/signup", register)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)
router.post("/updateProfile", auth, verifyLogistic, updateProfile)
router.get("/fetchProfile", auth, verifyLogistic, fetchProfile)
router.post("/switchAvailability", auth, verifyLogistic, switchAvailability)
router.post("/trackLoaction", auth, verifyLogistic, trackLocation)

//orders
router.get("/getLogisticDashboard", auth, verifyLogistic, getLogisticDashboard)
router.get("/getAllOrders", auth, verifyLogistic, getAllOrders)
router.get("/fetchActiveOrders", auth, verifyLogistic, fetchActiveOrders)
router.get("/getOrder", auth, verifyLogistic, getOrder)
router.post("/pickedUpStatus", auth, verifyLogistic, pickedUpStatus)
router.post("/outOfDeliveryStatus", auth, verifyLogistic, outOfDeliveryStatus)
router.post("/confirmDelivery", auth, verifyLogistic, confirmDelivery)


module.exports = { logisticRoutes: router }; 