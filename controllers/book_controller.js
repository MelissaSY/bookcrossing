'use strict';
const fs = require('fs');
const multer = require('multer');
const path = require('path');
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
        parseInt(req.body.id), req.body.title, req.body.author, req.body.genres, req.body.isbn);
    book.hasimage = true;
    book.filepath = req.file.filename;
    library.temporaryEdit(book);
    res.redirect('/books/edit/?id='+book.id);
};

const deleteImage=(req, res) => {
    let book = new Book(
        parseInt(req.body.id), req.body.title, req.body.author, req.body.genres, req.body.isbn);

    book.hasimage = false;
    book.filepath = '';
    library.temporaryEdit(book);
    res.redirect('/books/edit/?id='+book.id);
};

const saveChanges=(req, res)=> {
    let book;
    let oldBook = library.searchBookById(parseInt(req.body.id));
    book = new Book(
        parseInt(req.body.id), req.body.title, req.body.author, req.body.genres, req.body.isbn);
    if(req.file !== undefined) {
        book.hasimage = true;
        book.filepath = req.file.filename;
    } else if(oldBook !== null) {
        book.hasimage = oldBook.hasimage;
        book.filepath = oldBook.filepath;
    }
    library.editBookInfo(book);
    res.redirect('/books');
};

module.exports = {updateBook};