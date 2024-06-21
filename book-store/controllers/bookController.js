const { booksLogger } = require('../loggers');
const {
  books,
  Book,
  addBook,
  findBookByTitle,
  getFilteredBooks,
  findBookById,
  updateBookPrice,
  deleteBookById,
  getBookTitle,
} = require('../models/bookModel');

// Create book:
const createBook = (req, res) => {
  const { title, author, year, price, genres } = req.body;

  // Validations checks:

  const existingBook = findBookByTitle(title);
  if (existingBook) {
    return res.status(409).json({
      errorMessage: `Error: Book with the title [${title}] already exists in the system`,
    });
  }

  if (year < 1940 || year > 2100) {
    return res.status(409).json({
      errorMessage: `Error: Can't create new Book that its year [${year}] is not in the accepted range [1940 -> 2100]`,
    });
  }

  if (price < 0) {
    return res.status(409).json({
      errorMessage: `Error: Can't create new Book with negative price`,
    });
  }

  // Create new book:

  const newBook = new Book(title, author, year, price, genres);

  // Log book creation info:
  booksLogger.info(`Creating new Book with Title [${title}]`);
  booksLogger.debug(
    `Currently there are ${books.length} Books in the system. New Book will be assigned with id ${newBook.id}`
  );

  addBook(newBook);

  // Respond with the new book's ID
  res.status(200).json({ result: newBook.id });
};

// get totla books:

const getTotalBooks = (req, res) => {
  const filters = {
    author: req.query.author,
    priceBiggerThan: req.query['price-bigger-than']
      ? parseFloat(req.query['price-bigger-than'])
      : null,
    priceLessThan: req.query['price-less-than']
      ? parseFloat(req.query['price-less-than'])
      : null,
    yearBiggerThan: req.query['year-bigger-than']
      ? parseInt(req.query['year-bigger-than'])
      : null,
    yearLessThan: req.query['year-less-than']
      ? parseInt(req.query['year-less-than'])
      : null,
    genres: req.query.genres,
  };

  if (filters.genres) {
    const validGenres = [
      'SCI_FI',
      'NOVEL',
      'HISTORY',
      'MANGA',
      'ROMANCE',
      'PROFESSIONAL',
    ];
    const genresArray = filters.genres.split(',');
    for (const genre of genresArray) {
      if (!validGenres.includes(genre)) {
        return res
          .status(400)
          .json({ errorMessage: `Error: Invalid genre [${genre}]` });
      }
    }
  }

  const filteredBooks = getFilteredBooks(filters);
  booksLogger.info(
    `Total Books found for requested filters is ${filteredBooks.length}`
  );

  res.status(200).json({ result: filteredBooks.length });
};

// Get books:
const getBooks = (req, res) => {
  const filters = {
    author: req.query.author,
    priceBiggerThan: req.query['price-bigger-than']
      ? parseFloat(req.query['price-bigger-than'])
      : null,
    priceLessThan: req.query['price-less-than']
      ? parseFloat(req.query['price-less-than'])
      : null,
    yearBiggerThan: req.query['year-bigger-than']
      ? parseInt(req.query['year-bigger-than'])
      : null,
    yearLessThan: req.query['year-less-than']
      ? parseInt(req.query['year-less-than'])
      : null,
    genres: req.query.genres,
  };

  if (filters.genres) {
    const validGenres = [
      'SCI_FI',
      'NOVEL',
      'HISTORY',
      'MANGA',
      'ROMANCE',
      'PROFESSIONAL',
    ];
    const genresArray = filters.genres.split(',');
    for (const genre of genresArray) {
      if (!validGenres.includes(genre)) {
        return res
          .status(400)
          .json({ errorMessage: `Error: Invalid genre [${genre}]` });
      }
    }
  }

  let filteredBooks = getFilteredBooks(filters);

  // Sort the books by title (case insensitive)
  filteredBooks = filteredBooks.sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  );

  booksLogger.info(
    `Total Books found for requested filters is ${filteredBooks.length}`
  );
  res.status(200).json({ result: filteredBooks });
};

//Get single book data:
const getBookById = (req, res) => {
  const bookId = parseInt(req.query.id);
  const book = findBookById(bookId);

  if (!book) {
    return res.status(404).json({
      errorMessage: `Error: no such Book with id ${bookId}`,
    });
  }

  booksLogger.debug(`Fetching book id ${bookId} details`);

  res.status(200).json({ result: book });
};

// Update book price:

const updateBookPriceHandler = (req, res) => {
  const bookId = parseInt(req.query.id);
  const newPrice = parseFloat(req.query.price);

  const book = findBookById(bookId);

  if (!book) {
    return res
      .status(404)
      .json({ errorMessage: `Error: no such Book with id ${bookId}` });
  }

  if (newPrice < 0) {
    return res.status(409).json({
      errorMessage: `Error: price update for book [${bookId}] must be a positive integer`,
    });
  }

  const oldPrice = updateBookPrice(bookId, newPrice);

  //Log
  const bookTitle = getBookTitle(bookId);
  booksLogger.info(`Update Book id [${bookId}] price to ${newPrice}`);
  if (bookTitle) {
    booksLogger.debug(
      `Book [${bookTitle}] price changed: ${oldPrice} --> ${newPrice}`
    );
  }

  res.status(200).json({ result: oldPrice });
};

// Remove book:
const deleteBook = (req, res) => {
  const bookId = parseInt(req.query.id);

  const book = findBookById(bookId);

  if (!book) {
    res
      .status(404)
      .json({ errorMessage: `Error: no such Book with id ${bookId}` });
  }

  const bookTitle = getBookTitle(bookId);

  if (deleteBookById(bookId)) {
    // Log:

    if (bookTitle) {
      booksLogger.info(`Removing book [${bookTitle}]`);
      booksLogger.debug(
        `After removing book [${bookTitle}] id:[${bookId}] there are ${books.length} books in the system`
      );
    }

    res.status(200).json({ result: books.length });
  }
};

module.exports = {
  createBook,
  getTotalBooks,
  getBooks,
  getBookById,
  updateBookPriceHandler,
  deleteBook,
};
