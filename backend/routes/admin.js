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
    createLogistic,
    fetchlogisticOrders
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
    fetchServices,
    fetchItem
} = require('../controllers/admin/service.admin')

const {
    sendBulkEmails,
    getUser,
    fetchUsers,
    editUser,
    createUser,
    viewFeedbacks,
    fetchAllUserOrders
} = require("../controllers/admin/user.admin")

const {
    fetchAllVendor,
    getVendor,
    editVendor,
    createvendor,
    fetchVendorOrders
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
    additionaldetails,
    fetchMisc,
    updateDeliveryCharge
} = require("../controllers/admin/Charges.admin")
const {
    vendorSettlement,
    settleVendorAmount,
    viewHistory,
    logisticPickupSettlement,
    logisticDeliverySettlement
} = require("../controllers/admin/settlement.admin")

//auth
router.post("/credintials", logIP, credentials)
router.post("/verifyOTP", logIP, verifyOTP)
router.post("/twoSV", auth, logIP, twoSV)
router.put("/forgotPassword", auth, logIP, forgotPassword)
router.put("/forgotPasscode", auth, logIP, forgotPasscode)


//logistic
router.get("/fetchLogistic", auth, logIP, checkInactivity, fetchLogistic)
router.get("/getLogistic", auth, logIP, checkInactivity, getLogistic)
router.put("/updateLogistic", auth, logIP, checkInactivity, updateLogistic)
router.post("/createLogistic", auth, logIP, checkInactivity, createLogistic)
router.get("/logisticOrders", auth, logIP, checkInactivity, fetchlogisticOrders)

//user
router.get("/fetchUsers", auth, logIP, checkInactivity, fetchUsers)
router.put("/editUser", auth, logIP, checkInactivity, editUser)
router.get("/getUser", auth, logIP, checkInactivity, getUser)
router.get("/UserOrders", auth, logIP, checkInactivity, fetchAllUserOrders)
router.post("/createUser", auth, logIP, checkInactivity, createUser)
router.post("/sendemail", auth, logIP, checkInactivity, sendBulkEmails)
router.get("/viewFeedbacks", auth, logIP, checkInactivity, viewFeedbacks)

//vendors
router.get("/fetchVendors", auth, logIP, checkInactivity, fetchAllVendor)
router.get("/getVendor", auth, logIP, checkInactivity, getVendor)
router.put("/editVendor", auth, logIP, checkInactivity, editVendor)
router.post("/createvendor", auth, logIP, checkInactivity, createvendor)
router.get("/vendorOrders", auth, logIP, checkInactivity, fetchVendorOrders)

//orders
router.get("/fetchOrders", auth, logIP, checkInactivity, viewOrders)
router.get("/getOrder", auth, logIP, checkInactivity, getOrder)
router.put("/updateOrder", auth, logIP, checkInactivity, updateOrder)
router.get("/getCancelledOrders", auth, logIP, checkInactivity, getCancelledOrders)
router.post("/createOrder", auth, logIP, checkInactivity, createOrder)
router.get("/fetchOrdersByDateRange", auth, logIP, checkInactivity, fetchOrdersByDateRange)

//service
router.post("/addService", auth, logIP, checkInactivity, createService)
router.post("/addItem", auth, logIP, checkInactivity, addItemToService)
router.put("/editService", auth, logIP, checkInactivity, editService)
router.put("/editItemInService", auth, logIP, checkInactivity, editItemInService)
router.get("/fetchServices", auth, logIP, checkInactivity, fetchServices)
router.get("/fetchItem", auth, logIP, checkInactivity, fetchItem)

//settlement
router.get("/vendorSettlement", auth, logIP, checkInactivity, vendorSettlement)
router.get("/pickupSettlement", auth, logIP, checkInactivity, logisticPickupSettlement)
router.get("/deliverySettlement", auth, logIP, checkInactivity, logisticDeliverySettlement)
router.post("/settleVendorAmount", auth, logIP, checkInactivity, settleVendorAmount)
router.get("/history", auth, logIP, checkInactivity, viewHistory)

//misc
router.post("/DeliveryCharge", auth, logIP, checkInactivity, createDeliveryCharge)
router.put("/DeliveryCharge", auth, logIP, checkInactivity, updateDeliveryCharge)
router.post("/addFAQ", auth, logIP, checkInactivity, addFAQ)
router.put("/updateFAQ", auth, logIP, checkInactivity, updateFAQ)
router.delete("/deleteFAQ", auth, logIP, checkInactivity, deleteFAQ)
router.post("/additionaldetails", auth, logIP, checkInactivity, additionaldetails)
router.get("/fetchMisc", fetchMisc)



module.exports = { adminRoutes: router }; 