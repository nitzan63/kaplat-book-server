const postgresOperations = require('./postgresModel');
const mongoOperations = require('./mongoModel');

let nextID = 1;

const PERSISTENCE_METHODS = {
    POSTGRES: 'POSTGRES',
    MONGO: 'MONGO',
};

class DBManager {
    constructor() {
        this.initialize().catch(error => {
            throw new Error(`Database initialization failed - ${error.message}`);
        });
    }

    async initialize() {
        try {
            const postgresMaxId = await postgresOperations.initialize();
            const mongoMaxId = await mongoOperations.initialize();
            if (postgresMaxId != mongoMaxId) {
                throw new Error(`Database initialization failed - different max IDs pg:${postgresMaxId} != mongo:${mongoMaxId}`);
            }
            nextID = postgresMaxId + 1;
            this.initialized = true;
            return nextID;
        } catch (error) {
            throw new Error(`Database initialization failed - ${error.message}`);
        }
    }

    _validatePersistenceMethod(method) {
        if (!(method in PERSISTENCE_METHODS)) {
            throw new Error(`Invalid persistence method: ${method}`);
        }
    }

    async addBook(newBookData) {
        const id = nextID++;

        const newBook = {
            id,
            title: newBookData.title,
            author: newBookData.author,
            year: newBookData.year,
            price: newBookData.price,
            genres: newBookData.genres,
        };

        await Promise.all([
            postgresOperations.addBook(newBook),
            mongoOperations.addBook(newBook),
        ]);

        return id;
    }

    async isBookTitleExists(title) {
        const pgId = await postgresOperations.findBookByTitle(title);
        const mongoId = await mongoOperations.findBookByTitle(title);
        
        if (!pgId && !mongoId) {
            return false;
        }
        
        if (!pgId || !mongoId) {
            throw new Error(`Inconsistency: Book "${title}" exists in only one database`);
        }
        
        if (pgId !== mongoId) {
            throw new Error(`Mismatch in book id for title: ${title}`);
        }
        
        return true;
    }

    async getFilteredBooks(filters, persistenceMethod) {
        this._validatePersistenceMethod(persistenceMethod);
        switch (persistenceMethod) {
            case PERSISTENCE_METHODS.POSTGRES:
                return await postgresOperations.getFilteredBooks(filters);
            case PERSISTENCE_METHODS.MONGO:
                return await mongoOperations.getFilteredBooks(filters);
        }
    }
}

module.exports = new DBManager();
