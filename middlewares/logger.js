const winston = require("winston");
const expressWinston = require("express-winston");
const path = require("path");

const pathToLogs = path.join(__dirname, "../logs");

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(pathToLogs, "request.log"),
    }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(pathToLogs, "error.log"),
    }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
