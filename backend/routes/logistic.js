const express = require("express")
const router = express.Router()
const {
    register,
    verifyOTP,
    login,
    trackLocation,
    updateProfile,
    fetchProfile,
    switchAvailability,
    updateDocs
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
router.get("/fetchProfile", auth, verifyLogistic, fetchProfile)
router.put("/updateProfile", auth, verifyLogistic, updateProfile)
router.put("/updateDocs", auth, updateDocs)
router.post("/switchAvailability", auth, verifyLogistic, switchAvailability)
router.post("/trackLoaction", auth, verifyLogistic, trackLocation)

//orders
router.get("/dashboard", auth, verifyLogistic, getLogisticDashboard)
router.get("/getAllOrders", auth, verifyLogistic, getAllOrders)
router.get("/fetchActiveOrders", auth, verifyLogistic, fetchActiveOrders)
router.get("/getOrder", auth, verifyLogistic, getOrder)
router.post("/pickedUp", auth, verifyLogistic, pickedUpStatus)
router.post("/outOfDelivery", auth, verifyLogistic, outOfDeliveryStatus)
router.post("/delivered", auth, verifyLogistic, confirmDelivery)


module.exports = { logisticRoutes: router }; 