const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize('books', 'postgres', 'docker', {
    host: 'postgres',
    port: 5432,
    dialect: 'postgres',
    logging: false,
});



const PostgresBook = sequelize.define('book', {
    rawid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    genres: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    }
});

const postgresOperations = {
    async initialize() {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');

            const maxId = await PostgresBook.max('rawid');
            return maxId || 0;
        } catch (error) {
            console.error('Unable to connect to the postgres database:', error);
            throw error;
        }
    },

    async addBook(bookData) {
        const book = await PostgresBook.create({
            rawid: bookData.id,
            title: bookData.title,
            author: bookData.author,
            year: bookData.year,
            price: bookData.price,
            genres: bookData.genres,
        });
        return book;
    },

    async findBookByTitle(title) {
        const book = await PostgresBook.findOne({
            where: sequelize.where(
                sequelize.fn('LOWER', sequelize.col('title')),
                sequelize.fn('LOWER', title)
            )
        });
        return book ? book.rawid : null;
    },


    async getFilteredBooks(filters) {
        const whereClause = {};

        if (filters.author) {
            whereClause.author = sequelize.where(
                sequelize.fn('LOWER', sequelize.col('author')),
                sequelize.fn('LOWER', filters.author)
            );
        }

        if (filters.priceBiggerThan !== null) {
            whereClause.price = { [Op.gt]: filters.priceBiggerThan };
        }
        if (filters.priceLessThan !== null) {
            whereClause.price = { 
                ...(whereClause.price || {}), 
                [Op.lt]: filters.priceLessThan
            };
        }

        if (filters.yearBiggerThan !== null) {
            whereClause.year = { [Op.gt]: filters.yearBiggerThan };
        }

        if (filters.yearLessThan !== null) {
            whereClause.year = { 
                ...(whereClause.year || {}), 
                [Op.lt]: filters.yearLessThan 
            };
        }

        if (filters.genres) {
            const genersArray = filters.genres.split(',');
            whereClause.genres = { [Op.overlap]: genersArray };
        }

        const books = await PostgresBook.findAll({
            where: whereClause,
            order: [['title', 'ASC']],
        });

        return books.map (book => ({
            id: book.rawid,
            title: book.title,
            author: book.author,
            year: book.year,
            price: book.price,
            genres: book.genres,
        }));
    },

    async findBookById(id) {
        const book = await PostgresBook.findOne({
            where: { rawid: id },
        });

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
        const book = await PostgresBook.findOne({
            where: { rawid: id },
        });

        if (!book) {
            return null;
        }

        const oldPrice = book.price;
        await book.update({ price: newPrice });

        return oldPrice;
    },

    async deleteBookById(id) {
        const result = await PostgresBook.destroy({ where: { rawid: id } });
        return result === 1;
    },

    async getBooksCount() {
        return await PostgresBook.count();
    },

    async getMaxRawId() {
        return await PostgresBook.max('rawid');
    },

}

module.exports = postgresOperations;