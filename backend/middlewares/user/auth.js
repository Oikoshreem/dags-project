const User = require('../../models/user/user.model');
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth = async (req, res, next) => { 
    try {
        const token =
            req.body.token || 
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
            req.user = decode;
            console.log(req.user,"this")
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                error: error.message,
                message: 'Invalid Token'
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Something went wrong while validating the token'
        });
    }
}