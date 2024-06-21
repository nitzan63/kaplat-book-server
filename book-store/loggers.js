const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level.toUpperCase()}: ${message}`;
});

const requestLogger = createLogger({
  level: 'info',
  format: combine(timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }), logFormat),
  transports: [
    new transports.Console({ level: 'debug' }),
    new transports.File({ filename: 'logs/requests.log', level: 'debug' }),
  ],
});

const booksLogger = createLogger({
  level: 'info',
  format: combine(timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }), logFormat),
  transports: [
    new transports.File({ filename: 'logs/books.log', level: 'debug' }),
    new transports.Console({ level: 'debug' }),
  ],
});

module.exports = {
  requestLogger,
  booksLogger,
};
