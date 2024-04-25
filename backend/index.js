const express = require('express')
const bcrypt = require('bcrypt');
const Admin = require('./models/admin/admin.js');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const app= express()
const {admin_authRoutes} = require('./routes/admin/index.js');
const database = require('./config/database');
const sessionMiddleware = require('./middlewares/admin/session.js');

app.use(sessionMiddleware);
app.use(express.json());
app.use(cookieParser())
database.connect();

app.use("/admin/api", admin_authRoutes);
app.get('/', (req,res)=>{
    res.send('hi')
})

app.listen(process.env.PORT , ()=>{
    console.log(`server is running at port ${process.env.PORT}`)
})