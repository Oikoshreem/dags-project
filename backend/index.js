const express = require('express')
// const Admin = require('./models/admin.model.js');
require('dotenv').config()
const app= express()
const authRoutes = require('./routes/admin/auth.routes');
const database = require('./config/database');

app.use(express.json());
database.connect();

app.use("/auth", authRoutes);
app.get('/', (req,res)=>{
    res.send('hi')
})

app.listen(process.env.PORT , ()=>{
    console.log(`server is running at port ${process.env.PORT}`)
})