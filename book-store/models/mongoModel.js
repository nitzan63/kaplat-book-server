// mongoModel.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    rawid: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    genres: {
        type: [String],
        required: true,
    }
});

const MongoBook = mongoose.model('Book', bookSchema);

const mongoOperations = {
    async initialize() {
        try {
            await mongoose.connect('mongodb://localhost:27017/books', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('MongoDB connection established successfully.');

            const maxIdBook = await MongoBook.findOne().sort('-rawid');
            return maxIdBook ? maxIdBook.rawid : 0;
        } catch (error) {
            console.error('Unable to connect to the MongoDB database:', error);
            throw error;
        }
    },

    async addBook(bookData) {
        const book = new MongoBook({
            rawid: bookData.id,
            title: bookData.title,
            author: bookData.author,
            year: bookData.year,
            price: bookData.price,
            genres: bookData.genres,
        });
        await book.save();
        return book.rawid;
    },

    async findBookByTitle(title) {
        const book = await MongoBook.findOne({
            title: new RegExp(`^${title}$`, 'i')
        });
        return book ? book.rawid : null;
    },

    async getFilteredBooks(filters) {
        const query = {};

        if (filters.author) {
            query.author = new RegExp(`^${filters.author}$`, 'i');
        }

        if (filters.priceBiggerThan !== null) {
            query.price = { $gt: filters.priceBiggerThan };
        }
        if (filters.priceLessThan !== null) {
            query.price = { 
                ...(query.price || {}), 
                $lt: filters.priceLessThan 
            };
        }

        if (filters.yearBiggerThan !== null) {
            query.year = { $gt: filters.yearBiggerThan };
        }

        if (filters.yearLessThan !== null) {
            query.year = { 
                ...(query.year || {}), 
                $lt: filters.yearLessThan 
            };
        }

        if (filters.genres) {
            const genresArray = filters.genres.split(',');
            query.genres = { $in: genresArray };
        }

        const books = await MongoBook.find(query).sort('title');
        return books.map(book => ({
            id: book.rawid,
            title: book.title,
            author: book.author,
            year: book.year,
            price: book.price,
            genres: book.genres,
        }));
    },

    async findBookById(id) {
        const book = await MongoBook.findOne({ rawid: id });
        if (!book) {
            return null;
        }
        return {
            id: book.rawid,
            title: book.title,
            author: book.author,
            year: book.year,
            price: book.price,
            genres: book.genres,
        };
    },

    async updateBookPrice(id, newPrice) {
        const book = await MongoBook.findOne({ rawid: id });
        if (!book) {
            return null;
        }
        const oldPrice = book.price;
        book.price = newPrice;
        await book.save();
        return oldPrice;
    },

    async deleteBookById(id) {
        const result = await MongoBook.deleteOne({ rawid: id });
        return result.deletedCount === 1;
    },

    async getBooksCount() {
        return await MongoBook.countDocuments();
    },
};

module.exports = mongoOperations;