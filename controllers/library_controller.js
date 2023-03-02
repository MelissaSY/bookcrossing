'use strict';

const library = require('../entities/library');
const getBooks = (req, res) => {
    library.getAllAuthors(function(authors) {
        library.getAllBooks(function (books) {
            library.recreateConnections(function() {let sort;
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
        })
    });
};
const getAuthors = (req, res) => {
    library.getAllAuthors(function (authors) {
        let sort;
        if(req.query.sorting && req.query.sorting !== 'default') {
            sort = req.query.sorting;
            library.sortAuthors(sort);
        } else {
            sort = 'default';
        }
        if(req.query.filter && (req.query.filter !== 'all')) {
            res.render(
                'authors_list', {
                    authors: library.filterAuthors(req.query.filter, req.query.search_query),
                    filter: req.query.filter,
                    searched: req.query.search_query,
                    sorting: sort
                });
        } else {
            res.render(
                'authors_list', { authors: authors, filter: 'all', searched:'', sorting: sort});
        }
    });
};
const deleteBook=(req, res)=> {
    library.deleteBook(library.searchBookById(parseInt(req.body.id)));
    res.redirect('/books');
};
const deleteAuthor=(req, res)=> {
    

    library.deleteAuthor(library.searchAuthorById(parseInt(req.body.id)));
    res.redirect('/authors');
};
const editBook=(req, res) => {
    library.getAllAuthors(
          function(authors) {
            let book;
            let author_selected = '';
            library.recreateConnections(
                function() {
                    if(req.query.id === undefined) {
                        book = library.createNoAddBook();
                    } else {
                    book = library.searchBookById(parseInt(req.query.id));
                    }
                    if(book.authors.length > 0) {
                        author_selected = book.authors[0];
                    }
                    res.render('edit_book', {
                            book: book,
                            authors: authors,
                            author_selected: author_selected
                    });
        
                }
            );
        }
    );
};
const editAuthor=(req, res) => {
    let author;
    if(req.query.id === undefined) {
        author = library.createNoAddAuthor();
    } else {
        author = library.searchAuthorById(parseInt(req.query.id));
    }
    res.render('edit_author', {
        author: author,
    });
};
const addAuthor = (req, res) => {
    let author = library.createNoAddAuthor();
    res.redirect('/authors/edit?id='+author.id);
};
module.exports = {
    getBooks, deleteBook, editBook,
    getAuthors, addAuthor, deleteAuthor, editAuthor
};