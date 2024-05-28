const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8574;

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}/`)});

// Health check:

app.get('/books/health', (req , res) => {
    res.status(200).send('OK');
});