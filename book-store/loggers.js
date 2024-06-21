const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level.toUpperCase()}: ${message}`;
});

const commonFormat = combine(
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
  logFormat
);

const requestLogger = createLogger({
  level: 'info',
  format: commonFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/requests.log' }),
  ],
});

const booksLogger = createLogger({
  level: 'info',
  format: commonFormat,
  transports: [
    new transports.File({ filename: 'logs/books.log' }),
    new transports.Console(),
  ],
});

module.exports = {
  requestLogger,
  booksLogger,
};
