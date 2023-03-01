class Light_book {
    constructor(id, title, author='', genre='',  isbn='', annotation ='', filepath='', hasImage = false) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.id = id;
        this.annotation = annotation;
        this.genres = genre;
        this.filepath = filepath;
        this.hasimage = hasImage;
    }
}

module.exports = Light_book;