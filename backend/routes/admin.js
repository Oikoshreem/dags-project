const express = require("express")
const router = express.Router()
const {
    credentials,
    verifyOTP,
    twoSV
} = require("../controllers/admin/auth.admin")
const {
    addItemToService,
    createService
} = require('../controllers/admin/service.admin')
const { sendBulkEmails} = require("../controllers/admin/user.admin")
const { logIP, auth } = require('../middlewares/admin/auth')

//auth
router.post("/credintials", logIP, credentials)
router.post("/verifyOTP", logIP, verifyOTP)
router.post("/twoSV", logIP, auth, twoSV)
router.post("/sendemail", sendBulkEmails)


//service
router.post("/addService", createService)
router.post("/addItem", addItemToService)


module.exports = { adminRoutes: router }; 