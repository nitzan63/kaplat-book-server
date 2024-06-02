
let books = []
let nextId = 1

class Book {
    constructor(title, author, year, price, genres){
        this.id = nextId++
        this.title = title
        this.author = author
        this.year = year
        this.price = price
        this.genres = genres
    }
}

const addBook = (book) => {
    books.push(book)
}

const findBookByTitle = (title) => {
    return books.find(book => book.title.toLowerCase() === title.toLowerCase());
};

const getFilteredBooks = (filters) => {
    return books.filter( book => {
        if (filters.author && book.author.toLowerCase() !== filters.author.toLowerCase()){
            return false
        }
        if (filters.priceBiggerThan && book.price < filters.priceBiggerThan){
            return false
        }
        if (filters.priceLessThan && book.price > filters.priceLessThan){
            return false
        }
        if (filters.yearBiggerThan && book.year < filters.yearBiggerThan) {
            return false;
        }
        if (filters.yearLessThan && book.year > filters.yearLessThan) {
            return false;
        }
        if (filters.genres) {
            const genresArray = filters.genres.split(',');
            const hasGenre = genresArray.some(genre => book.genres && book.genres.includes(genre));
            if (!hasGenre) {
                return false;
            }
        }
        return true;
    })
}

module.exports ={
    Book,
    addBook,
    findBookByTitle,
    getFilteredBooks
}