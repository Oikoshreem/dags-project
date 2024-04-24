const token = jwt.sign(
    { email: admin.email, id: admin._id },
    process.env.JWT_SECRET,
    {
        expiresIn: "30m",
    }
);

admin.token = token;
admin.password = undefined;
const options = {
    expires: new Date(Date.now() + 30 * 60 * 1000),
    httpOnly: true,
};
res.cookie("token", token, options).status(200).json({
    success: true,
    token,
    admin,
    message: `Admin Login Successful`,
});