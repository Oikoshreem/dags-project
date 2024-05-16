const express = require("express")
const router = express.Router()
const {
    credentials,
    verifyOTP,
    twoSV
} = require("../controllers/admin/auth.admin")

const {
} = require('../controllers/admin/logistic.admin')

const { } = require('../controllers/admin/order.admin')

const { addItemToService,
    createService,
    editService,
    editItemInService,
    fetchServices } = require('../controllers/admin/service.admin')

const { sendBulkEmails, getUser } = require("../controllers/admin/user.admin")

const { } = require("../controllers/admin/vendor.admin")

const { logIP, auth } = require('../middlewares/admin/auth')

//auth
router.post("/credintials", logIP, credentials)
router.post("/verifyOTP", logIP, verifyOTP)
router.post("/twoSV", logIP, auth, twoSV)
router.post("/sendemail", sendBulkEmails)


//service
router.post("/addService", createService)
router.post("/addItem", addItemToService)

//user
// router.get("/getUser", getUser)


module.exports = { adminRoutes: router }; 