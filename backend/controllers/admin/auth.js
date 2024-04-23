const Admin = require('../../models/admin/admin');

exports.credentials = async (req, res) => {
    try{
        const {email,password} = req.body;

        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: admin.email, id: user._id, accountType: user.accountType },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                }
            );
        }
        const phone = admin.phone;

    }catch{
        console.log(error)
    }
}