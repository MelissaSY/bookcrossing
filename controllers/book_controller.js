'use strict';

const library = require('../entities/library');
let Book = require ("../entities/light_book.js");
const updateBook = (req, res) => {
    let book = new Book(
        parseInt(req.body.id), req.body.title, req.body.author, req.body.genres, req.body.isbn);
    library.editBookInfo(book);
    console.log(req);
    res.redirect('/books');
};

const saveImage=()=>{

};

module.exports = {updateBook};