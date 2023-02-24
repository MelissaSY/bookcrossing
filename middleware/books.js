'use strict';

const express = require('express');
const library = require('../entities/library');

let Book = require ("../entities/light_book.js");
const {router} = require("express/lib/application");

module.exports = function (options = {}) {
    const router = express.Router();
    const {service} = options;

    router.get('',(req, res, next) => {
        library.getAllBooks(function (books) {
            let sort;
            if(req.query.sorting && req.query.sorting !== 'default') {
                sort = req.query.sorting;
                library.sortBooks(sort);
            }
            else
            {
                sort = 'default';
            }
            if(req.query.filter && (req.query.filter !== 'all')) {
                res.render(
                    'books_list', {
                        books: library.filterBooks(req.query.filter, req.query.search_query),
                        filter: req.query.filter,
                        searched: req.query.search_query,
                        sorting: sort
                    });
            } else {
                res.render(
                    'books_list', { books: books, filter: 'all', searched:'', sorting: sort});
            }
        });
    });
    router.post('/edit', (req, res, next) => {
        let book = new Book(
            parseInt(req.body.id), req.body.title, req.body.author, req.body.genres, req.body.isbn);
        library.editBookInfo(book);
        res.redirect('/books');
    });
    router.get('/edit', (req, res, next) => {
        let book = library.searchBookById(parseInt(req.query.id));
        res.render('edit_book', {
            book: book,
        });
    });
    router.get('/add', (req, res, next) => {
        let book = library.createEmptyBook();
        res.render('edit_book', {
            book: book,
        });
    });
    router.post('/delete', (req, res, next) =>{
        library.deleteBook(library.searchBookById(parseInt(req.body.id)));
        res.redirect('/books');
    });
    return router;
};