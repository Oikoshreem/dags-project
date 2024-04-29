const Admin = require('../../models/admin/admin');
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.logIP = async (req, res, next) => {
  const ip = req.ip;
  console.log("hi", ip)
  const { email } = req.body
  const admin = await Admin.findOne({ email: email });
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }
  const isNewIP = !admin.ip.includes(ip);
  req.body.isNewIP = isNewIP;
  // const IP = req.headers['x-forwarded-for'] || req.ip
  console.log(`IP Address: ${ip}`);
  next();
};

exports.auth = async (req, res, next) => {
  try {
    const token = 
      req.body.token||
      req.cookies.token
      || req.header("Authorization").replace("Bearer ", "")
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = decode;
    }
    catch (error) {
      return res.status(401).json({
        success: false,
        error:error.message,
        message: 'Invalid Token'
      });
    }
    next();
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      error:error.message,
      message: 'Something went wrong while validating the token'
    });
  }
}