// Endpoint to find shortest distance

  






// alert(getDistanceFromLatLonInKm(59.3293371,13.4877472,59.3225525,13.4619422).toFixed(1));



// function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
//   var R = 6371; // Radius of the earth in km
//   var dLat = deg2rad(lat2-lat1);  // deg2rad below
//   var dLon = deg2rad(lon2-lon1); 
//   var a = 
//     Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
//     Math.sin(dLon/2) * Math.sin(dLon/2)
//     ; 
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//   var d = R * c; // Distance in km
//   return d;
// }

// function deg2rad(deg) {
//   return deg * (Math.PI/180)



// const User = require("../models/User");
// const OTP = require("../models/OTP");
// let otpGenerator = require("otp-generator");
// let bcrypt = require('bcrypt');
// const Profile = require('../models/Profile')
// const jwt = require('jsonwebtoken');
// require("dotenv").config;
// const {passwordUpdated} = require('../mail/templates/passwordUpdate');
// const {mailSender} = require('../utils/mailSender')

// exports.changePassword = async (req, res) => {

//     try {
//         const userDetails = await User.findById(req.user.id);
//         const { oldPassword, newPassword, confirmNewPassword } = req.body;
//         const isPasswordMatch = await bcrypt.compare(
//             oldPassword,
//             userDetails.password
//         );
//         if (!isPasswordMatch) {
//             return res
//                 .status(401)
//                 .json({ success: false, message: "The password is incorrect" });
//         }
//         if (newPassword !== confirmNewPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "The password and confirm password does not match",
//             });
//         }
//         const encryptedPassword = await bcrypt.hash(newPassword, 10);
//         const updatedUserDetails = await User.findByIdAndUpdate(
//             req.user.id,
//             { password: encryptedPassword },
//             { new: true }
//         );

//         // Send notification email
//         try {
//             const emailResponse = await mailSender(
//                 updatedUserDetails.email,
//                 passwordUpdated(
//                     updatedUserDetails.email,
//                     `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
//                 )
//             );
//             // console.log("Email sent successfully:", emailResponse.response);
//         } catch (error) {
//             // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
//             console.error("Error occurred while sending email:", error);
//             return res.status(500).json({
//                 success: false,
//                 message: "Error occurred while sending email",
//                 error: error.message,
//             });
//         }

//         return res
//             .status(200)
//             .json({ success: true, message: "Password updated successfully" });
//     } catch (error) {
//         // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
//         // console.error("Error occurred while updating password:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Error occurred while updating password",
//             error: error.message,
//         });
//     }

// }