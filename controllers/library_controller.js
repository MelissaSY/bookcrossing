'use strict';

const library = require('../entities/library');
const {temporaryEdit} = require("../entities/library");

const getBooks = (req, res) => {
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
};
const deleteBook=(req, res)=> {
    library.deleteBook(library.searchBookById(parseInt(req.body.id)));
    res.redirect('/books');
};

const editBook=(req, res) => {
    let book;
    if(req.query.id === undefined) {
        book = library.createNoAdd();
    } else {
        book = library.searchBookById(parseInt(req.query.id));
    }
    res.render('edit_book', {
        book: book,
    });
};

module.exports = {getBooks, deleteBook, editBook};