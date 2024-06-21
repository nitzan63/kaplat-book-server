const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookRoutes');
const { requestLogger } = require('./loggers');

const app = express();
const port = 8574;

app.use(bodyParser.json());

// set request counter
let requestCounter = 1;

// Health check:
app.get('/books/health', (req, res) => {
  res.status(200).send('OK');
});

// Middleware for logging requests:

app.use((req, res, next) => {
  const requestId = requestCounter++;
  const start = Date.now();
  // Log incoming request:
  requestLogger.info(
    `Incoming request | #${requestId} | resource: ${req.originalUrl} | HTTP Verb ${req.method} | request #${requestId}`
  );

  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log the request duration:
    requestLogger.debug(
      `request #${requestId} duration: ${duration}ms | request #${requestId}`
    );
  });

  next();
});

app.use(bookRoutes);

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}/`);
});
