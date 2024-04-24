const express = require('express')
const bcrypt = require('bcrypt');
const Admin = require('./models/admin/admin.js');
require('dotenv').config()
const app= express()
const {admin_authRoutes} = require('./routes/admin/index.js');
const database = require('./config/database');
const sessionMiddleware = require('./middlewares/admin/session.js');

app.use(sessionMiddleware);
app.use(express.json());
database.connect();

init();
async function init() {
    let user = await Admin.findOne()
    if (user) {
        console.log("Admin user already present", user)
        return
    }
    try {
        let user = await Admin.create({
            name: "Admin",
            email: "aradhyagupta445@gmail.com",
            password: bcrypt.hashSync("Oiko@1314", 8),
            passcode:"345234",
            phone:"8299112380"
        })
        console.log(user)
    } catch (err) {
        console.log(err.message)
    }
}

app.use("/admin/api", admin_authRoutes);
app.get('/', (req,res)=>{
    console.log(req.ip)
    res.send('hi')
})

app.listen(process.env.PORT , ()=>{
    console.log(`server is running at port ${process.env.PORT}`)
})