// middleware/errorLogger.js
const fs = require('fs');
const path = require('path');

// Create a log directory if it doesn't exist
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const errorLogger = (err, req, res, next) => {
    const logFilePath = path.join(logDirectory, 'error.log');
    const errorMessage = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n\n`;
    
    // Append the error message to the log file
    fs.appendFile(logFilePath, errorMessage, (err) => {
        if (err) {
            console.error('Failed to write to log file', err);
        }
    });
    
    // Pass the error to the next middleware
    next(err);
};

module.exports = errorLogger;
