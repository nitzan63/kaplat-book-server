const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')

// Route for creating a new book:
router.post('/book' , bookController.createBook)
// Route for getting the total number of books:
router.get('/books/total', bookController.getTotalBooks)
// Route for getting books data:
router.get('/books', bookController.getBooks)
// Route for getting single book data:
router.get('/book', bookController.getBookById)
// Route for updating the price of a book:
router.put('/book', bookController.updateBookPriceHandler)
// Route for deleting book
router.delete('/book', bookController.deleteBook)

module.exports = router
