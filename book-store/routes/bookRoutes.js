const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')

// Route for creating a new book:
router.post('/book' , bookController.createBook)

router.get('/books/total', bookController.getTotalBooks)

module.exports = router
