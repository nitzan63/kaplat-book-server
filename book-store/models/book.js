
let books = []
let nextId = 1

class Book {
    constructor(title, author, year, price, genre){
        this.id = nextId++
        this.title = title
        this.author = author
        this.year = year
        this.price = price
        this.genre = genre
    }
}

const addBook = (book) => {
    books.push(book)
}

const findBookByTitle = (book) => {
    return books.find(book => book.title.toLowerCase() === title.toLowerCase())
}

module.exports ={
    Book,
    addBook,
    findBookByTitle
}