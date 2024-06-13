const express = require('express')
const bcrypt = require('bcrypt');
const path = require('path');
const Admin = require('./models/admin/admin.js');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app= express()
const {adminRoutes} = require('./routes/admin.js');
const { vendorRoutes } = require('./routes/vendor.js');
const { logisticRoutes } = require('./routes/logistic.js');
const { userRoutes } = require('./routes/user.js');
const database = require('./config/database');
const sessionMiddleware = require('./middlewares/admin/session.js');
app.use(express.static(path.join(__dirname, 'public')));
const errorLogger = require('./middlewares/admin/errorHandler.js');

app.use(sessionMiddleware);
app.use(express.json());
app.use(cookieParser())
app.use(cors());
database.connect();

app.use(errorLogger);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
});


app.get('/error', (req, res) => {
    throw new Error('This is a test error!');
});
  
app.use("/admin/api", adminRoutes);
app.use("/client/api", userRoutes);
app.use("/vendor/api", vendorRoutes);
app.use("/logistic/api", logisticRoutes);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(process.env.PORT , ()=>{
    console.log(`server is running at port ${process.env.PORT}`)
})

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    server.close(() => {
        process.exit(1);
    });
});


process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    server.close(() => {
        process.exit(1);
    });
});