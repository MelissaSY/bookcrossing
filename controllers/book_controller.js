'use strict';
const multer = require('multer');
const library = require('../entities/library');
let Book = require ("../entities/light_book.js");

const uploadImage = multer({
    dest:"images",
    fileFilter: function (req, file, callback) {
        if(file.mimetype === "image/png" ||
            file.mimetype === "image/jpg"||
            file.mimetype === "image/jpeg") {
            callback(null, true);
        } else {
            callback(new Error('Only images are allowed'), false);
        }
    }
}).single('book_image');

const updateBook = (req, res) => {
    uploadImage(req, res, function (err) {
        if (err) {
            return res.end('Error uploading file');
        }
        if(req.body.save_changes !== undefined) {
            saveChanges(req, res);
        } else if(req.body.delete_image !== undefined) {
            deleteImage(req, res);
        } else if(req.body.upload_image !== undefined && req.file !== undefined) {
            updateImage(req, res);
        }
    });
};

const updateImage=(req, res)=> {
    let book = new Book(
        parseInt(req.body.id), req.body.title, req.body.genres, req.body.isbn);
    book.hasimage = true;
    book.filepath = req.file.filename;
    if(req.body.author !== undefined) {
        book.authors[0] = req.body.author;
    }
    library.temporaryEditBook(book);
    res.redirect('/books/edit?id='+book.id);
};

const deleteImage=(req, res) => {
    let book = new Book(
        parseInt(req.body.id), req.body.title, req.body.genres, req.body.isbn);

    if(req.body.author !== undefined) {
        book.authors[0] = req.body.author;
    }
    book.hasimage = false;
    book.filepath = '';
    library.temporaryEditBook(book);
    res.redirect('/books/edit/?id='+book.id);
};

const saveChanges=(req, res)=> {
    let oldBook = library.searchBookById(parseInt(req.body.id));
    let book = new Book(
        parseInt(req.body.id), req.body.title, req.body.genres, req.body.isbn);
    if(req.file !== undefined) {
        book.hasimage = true;
        book.filepath = req.file.filename;
    } else if(oldBook !== null) {
        book.hasimage = oldBook.hasimage;
        book.filepath = oldBook.filepath;
    }
    
    if(req.body.author !== undefined) {
        book.authors[0] = req.body.author;
    } else if(oldBook !== null) {
        book.authors[0] = oldBook.authors;
    }
    if(book.isbn.length !== 13 || isNaN(parseInt(book.isbn))){
        book.isbn = '';
    }
    library.editBookInfo(book);
    res.redirect('/books');
};

module.exports = {updateBook};