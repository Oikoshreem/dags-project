// // logger.js
// const winston = require('winston');
// const { createLogger, format, transports } = winston;
// const { combine, timestamp, printf } = format;

// const logFormat = printf(({ level, message, timestamp }) => {
//   return `${timestamp} ${level}: ${message}`;
// });

// const logger = createLogger({
//   level: 'error',
//   format: combine(
//     timestamp(),
//     logFormat
//   ),
//   transports: [
//     new transports.Console(),
//     new transports.File({ filename: 'error.log', level: 'error' })
//   ],
// });

// module.exports = logger;
