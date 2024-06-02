const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookRoutes')

const app = express();
const port = 8574;

app.use(bodyParser.json());

app.use(bookRoutes)

app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}/`)
});

// Health check:
app.get('/books/health', (req , res) => {
    res.status(200).send('OK');
});