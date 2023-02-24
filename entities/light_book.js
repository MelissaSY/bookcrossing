class Light_book {
    constructor(id, title, author='', genre='',  isbn='', annotation ='') {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.id = id;
        this.annotation = annotation;
        this.genres = genre;
    }
}

module.exports = Light_book;