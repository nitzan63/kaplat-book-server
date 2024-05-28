const { Book, addBook, findBookByTitle } = require('../models/bookModel');

const createBook = (req, res) => {
    const {title, author, year, price, genre} = req.body;

    // Validation checks:

    const existingBook = findBookByTitle(title)
    if (existingBook){
        return res.status(409).json({ errorMessage: `Error: Book with the title [${title}] already exists in the system` })
    }

    if (year < 1940 || year > 2100){
        return res.status(409).json({ errorMessage: `Error: Can't create new Book that its year [${year}] is not in the accepted range [1940 -> 2100]` });
    }

    if (price < 0){
        return res.status(409).json({ errorMessage: `Error: Can't create new Book with negative price` });
    }

    // Create new book:

    const newBook = new Book(title, author, year, price, genre)
    addBook(newBook)

    // Respond with the new book's ID
    res.status(200).json({ result: newBook.id });

}

module.exports{
    createBook
};