'use strict';

const mysql = require('../storage_managment/mysql_manager');
let Book = require ("./light_book.js");
let Author = require("./author.js");

let books = [];
let authors = [];

const createNoAddBook=()=>{
    let id = getNextIdBook();
    let book = new Book(id, '', '');
    books.push(book);
    return book;
};

const createNoAddAuthor=()=>{
    let id = getNextIdAuthor();
    let author = new Author(id, '');
    authors.push(author);
    return author;
};

const sort = (selectedSorting, a, b) => {
    let A = a[selectedSorting];
    let B = b[selectedSorting];
    if(A > B) {
        return 1;
    }
    if(A < B) {
        return -1;
    }
    else {
        return 0;
    }
};

const sortBooks=(selectedSorting) => {
    books.sort((a, b) => {return sort(selectedSorting, a, b)});
    return books;
};

const sortAuthors=(selectedSorting) => {
    authors.sort((a, b) => {return sort(selectedSorting, a, b)});
    return authors;
};

const filterBooks=(selectedFilter, filterValue)=> {
    let filtered = [];
    for(let i =0; i < books.length;i++) {
        if(books[i][selectedFilter].toLowerCase().includes(filterValue.toLowerCase())) {
            filtered.push(books[i]);
        }
    }
    return filtered;
};
const filterAuthors=(selectedFilter, filterValue)=> {
    let filtered = [];
    for(let i =0; i < authors.length;i++) {
        if(authors[i][selectedFilter].toLowerCase().includes(filterValue.toLowerCase())) {
            filtered.push(authors[i]);
        }
    }
    return filtered;
};
const searchBookById=(id) => {
    let i = 0;

    while(i < books.length && books[i].id !== id) {
        i++;
    }
    if(i < books.length) {
        return books[i];
    }
    return null;
};

const searchAuthorById=(id) => {
    let i = 0;
    while(i < authors.length && authors[i].id !== id) {
        i++;
    }
    if(i < authors.length) {
        return authors[i];
    }
    return null;
};

const searchAuthorByPseudonym =(pseudonym)=> {
    let i =0;
    while(i < authors.length && authors[i].pseudonym !== pseudonym) {
        i++;
    }
    if(i < authors.length) {
        return authors[i];
    }
    return null;
}

const getAllBooks=(callback) => {
    books.length = 0;
    mysql.getAllLightBooks(function (result) {
        if(result !== null) {
            for(let i = 0; i < result.length; i++) {
                books.push(
                    new Book(
                        result[i].id_book,
                        result[i].title,
                        result[i].genres,
                        result[i].isbn,
                        result[i].annotation,
                        result[i].filepath,
                        result[i].has_image
                ));
            }
        }
        callback(books);
    });
};

const getAllAuthors=(callback) => {
    authors.length = 0;
    mysql.getAllAuthors(function(result) {
        if(result !== null) {
            for(let i = 0; i < result.length; i++) {
                authors.push(
                    new Author(
                        result[i].id_author, 
                        result[i].pseudonym, 
                        result[i].name, 
                        result[i].surname, 
                        result[i].patronymic
                    )
                )
            }
        }
        callback(authors);
    });
};

const recreateConnections=(callback)=> {
    mysql.getBookAuthorConnections(function(books_authors) {
        for(let book_author of books_authors) {
            let book = searchBookById(book_author.id_book);
            let author = searchAuthorById(book_author.id_author);
            if(author !== null && book !== null) {
                book.authors.push(author.pseudonym);
            }
        }
        callback();
    });
};

const createEmptyBook=()=> {
    let id = 0;
    for(let i = 0; i < books.length; i++) {
        if(books[i].id >= id) {
            id = books[i].id;
            id++;
        }
    }
    let newBook = new Book(id, '', '');
    books.push(newBook);
    mysql.addLightBook(newBook);
    return newBook;
};

const getNextIdBook=() => {
  let maxId = -1;
  for(let book of books) {
      if(book.id > maxId) {
          maxId = book.id;
      }
  }
  maxId++;
  return maxId;
};

const getNextIdAuthor = () => {
    let maxId = -1;
    for(let author of authors) {
        if(author.id > maxId) {
            maxId = author.id;
        }
    }
    maxId++;
    return maxId;
};

const editBookInfo=(book)=> {
    temporaryEditBook(book);
    mysql.deleteAuthorBookBookConnection(book.id, function() {
        mysql.updateOrAddLightBook(book, function() {
            for(let pseudonym of book.authors) {
                mysql.getAuthorByPseudonym(pseudonym, function(result) {    
                    if(result !== null) {
                      mysql.createAuthorBookConnection(result[0].id_author, book.id);
                    }
                });
            }
        });
    });
};

const editAuthorInfo=(author) => {
    temporaryEditAuthor(author);
    mysql.updateOrAddAuthor(author);
};

const deleteBook=(book)=> {
    let deleted = false;
    let i = 0;
    while(i < books.length && books[i].id !== book.id) {
        i++;
    }
    if(i < books.length) {
        books.splice(i, 1);
        mysql.deleteLightBook(book.id);
        deleted = true;
    }
    return deleted;
};

const deleteAuthor = (author) => {
    mysql.getBookAuthorByAuthor(author.id,
        function(result) {
        if(result.length === 0) {
            let i = 0;
            while(i < authors.length && authors[i].id !== author.id) {
                i++;
            }
            if(i < authors.length) {
                authors.splice(i, 1);
                mysql.deleteAuthor(author.id);
            }
        }
    });
};

const temporaryEditBook=(book)=> {
    let edited = false;
    let i = 0;
    while(i < books.length && books[i].id !== book.id) {
        i++;
    }
    if(i < books.length) {
        books[i] = book;
        edited = true;
    }
    return edited;
};

const temporaryEditAuthor=(author)=> {
    let edited = false;
    let i = 0;
    while(i < authors.length && authors[i].id !== author.id) {
        i++;
    }
    if(i < authors.length) {
        authors[i] = author;
        edited = true;
    }
    return edited;
};

module.exports = {
    temporaryEditBook, temporaryEditAuthor, 
    createNoAddBook, createNoAddAuthor,
    sortBooks, sortAuthors, 
    filterBooks, filterAuthors,
    searchBookById, searchAuthorById,
    getAllBooks, getAllAuthors,
    createEmptyBook, 
    editBookInfo, editAuthorInfo,
    deleteBook, deleteAuthor, 

    searchAuthorByPseudonym, recreateConnections,
};