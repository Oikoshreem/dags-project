const express = require("express")
const router = express.Router()

const {
    credentials,
    verifyOTP,
    twoSV,
    forgotPassword,
    forgotPasscode
} = require("../controllers/admin/auth.admin")

const {
    fetchLogistic,
    getLogistic,
    updateLogistic,
    createLogistic
} = require('../controllers/admin/logistic.admin')

const {
    viewOrders,
    getOrder,
    updateOrder,
    getCancelledOrders,
    createOrder,
    fetchOrdersByDateRange
} = require('../controllers/admin/order.admin')

const {
    addItemToService,
    createService,
    editService,
    editItemInService,
    fetchServices
} = require('../controllers/admin/service.admin')

const {
    sendBulkEmails,
    getUser,
    fetchUsers,
    editUser,
    createUser,
    viewFeedbacks
} = require("../controllers/admin/user.admin")

const {
    fetchAllVendor,
    getVendor,
    editVendor,
    createvendor
} = require("../controllers/admin/vendor.admin")

const {
    logIP,
    auth,
    checkInactivity
} = require('../middlewares/admin/auth')

const {
    createDeliveryCharge,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    additionaldetails
} = require("../controllers/admin/Charges.admin")

//auth
router.post("/credintials", logIP, credentials)
router.post("/verifyOTP", logIP, verifyOTP)
router.post("/twoSV", auth, logIP, twoSV)
router.post("/forgotPassword", auth, logIP, forgotPassword)
router.post("/forgotPasscode", auth, logIP, forgotPasscode)
router.post("/twoSV", auth, logIP, twoSV)

//misc
router.post("/createDeliveryCharge", auth, logIP, checkInactivity, createDeliveryCharge)
router.post("/addFAQ", auth, logIP, checkInactivity, addFAQ)
router.post("/updateFAQ", auth, logIP, checkInactivity, updateFAQ)
router.post("/deleteFAQ", auth, logIP, checkInactivity, deleteFAQ)
router.post("/additionaldetails", auth, logIP, checkInactivity, additionaldetails)


//logistic
router.post("/fetchLogistic", auth, logIP, checkInactivity, fetchLogistic)
router.post("/getLogistic", auth, logIP, checkInactivity, getLogistic)
router.post("/updateLogistic", auth, logIP, checkInactivity, updateLogistic)
router.post("/createLogistic", auth, logIP, checkInactivity, createLogistic)

//orders
router.get("/viewOrders", auth, logIP, checkInactivity, viewOrders)
router.get("/getOrder", auth, logIP, checkInactivity, getOrder)
router.post("/updateOrder", auth, logIP, checkInactivity, updateOrder)
router.get("/getCancelledOrders", auth, logIP, checkInactivity, getCancelledOrders)
router.post("/createOrder", auth, logIP, checkInactivity, createOrder)
router.get("/fetchOrdersByDateRange", auth, logIP, checkInactivity, fetchOrdersByDateRange)


//service
router.post("/addService", auth, logIP, checkInactivity, createService)
router.post("/addItem", auth, logIP, checkInactivity, addItemToService)
router.put("/editService", auth, logIP, checkInactivity, editService)
router.put("/editItemInService", auth, logIP, checkInactivity, editItemInService)
router.get("/fetchServices", auth, logIP, checkInactivity, fetchServices)

//user
router.get("/fetchUsers", auth, logIP, checkInactivity, fetchUsers)
router.put("/editUser", auth, logIP, checkInactivity, editUser)
router.get("/getUser", auth, logIP, checkInactivity, getUser)
router.post("/createUser", auth, logIP, checkInactivity, createUser)
router.post("/sendemail", auth, logIP, checkInactivity, sendBulkEmails)
router.get("/viewFeedbacks", auth, logIP, checkInactivity, viewFeedbacks)

//vendors
router.get("/fetchAllVendors", auth, logIP, checkInactivity, fetchAllVendor)
router.get("/getVendor", auth, logIP, checkInactivity, getVendor)
router.put("/editVendor", auth, logIP, checkInactivity, editVendor)
router.post("/createvendor", auth, logIP, checkInactivity, createvendor)

module.exports = { adminRoutes: router }; 