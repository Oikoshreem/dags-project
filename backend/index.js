const express = require('express')
const bcrypt = require('bcrypt');
const Admin = require('./models/admin/admin.js');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const app= express()
const {adminRoutes} = require('./routes/admin.js');
const { vendorRoutes } = require('./routes/vendor.js');
const { logisticRoutes } = require('./routes/logistic.js');
const { userRoutes } = require('./routes/user.js');
const database = require('./config/database');
const sessionMiddleware = require('./middlewares/admin/session.js');

app.use(sessionMiddleware);
app.use(express.json());
app.use(cookieParser())
database.connect();

app.use("/admin/api", adminRoutes);
app.use("/client/api", userRoutes);
app.use("/vendor/api", vendorRoutes);
app.use("/logistic/api", logisticRoutes);
app.get('/', (req,res)=>{
    res.send('hi')
})

app.listen(process.env.PORT , ()=>{
    console.log(`server is running at port ${process.env.PORT}`)
})