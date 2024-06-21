const { requestLogger, booksLogger } = require('../loggers');

// Get logger by name:

const getLoggerByName = (loggerName) => {
  switch (loggerName) {
    case 'request-logger':
      return requestLogger;
    case 'books-logger':
      return booksLogger;
    default:
      return null;
  }
};

const loggers = {
  'request-logger': requestLogger,
  'books-logger': booksLogger,
};

const getLogLevel = (req, res) => {
  const loggerName = req.query['logger-name'];

  if (!loggerName || !loggers[loggerName]) {
    return res.status(400).send('Error: invalid logger name');
  }

  const logger = loggers[loggerName];
  const level = logger.level.toUpperCase();
  res.status(200).send(level);
};

const setLogLevel = (req, res) => {
  const loggerName = req.query['logger-name'];
  const loggerLevel = req.query['logger-level'].toLowerCase();
  const logger = getLoggerByName(loggerName);

  if (!logger) {
    res.status(400).send('Error: invalid logger name');
  }

  if (!['error', 'info', 'debug'].includes(loggerLevel)) {
    res.status(400).send('Error: Invalid logger level');
  }

  logger.level = loggerLevel;

  res.status(200).send(loggerLevel.toUpperCase());
};

module.exports = {
  getLogLevel,
  setLogLevel,
};
