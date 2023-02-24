'use strict';

const mysql = require('../storage_managment/mysql_manager');
let Book = require ("./light_book.js");

let books = [];

const sortBooks=(selectedSorting) => {
    books.sort((a, b) => {
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
    });
    return books;
};

const filterBooks=(selectedFilter, filterValue)=> {
    let filtered = [];
    for(let i =0; i < books.length;i++) {
        console.log(selectedFilter);
        if(books[i][selectedFilter].includes(filterValue)) {
            filtered.push(books[i]);
        }
    }
    return filtered;
};
const searchBookById=(id) => {
    let currBook = null;
    let i = 0;
    while(i < books.length && books[i].id !== id) {
        i++;
    }
    if(i < books.length) {
        currBook = books[i];
    }
    return currBook;
};

const getAllBooks=(callback) => {
    mysql.getAllLightBooks(function (result) {
        if(result !== null) {
            for(let i =0; i < result.length; i++) {
                if(searchBookById(result[i].id_book) === null) {
                    books.push(new Book(result[i].id_book,
                        result[i].title, result[i].author, result[i].genres,
                        result[i].isbn, result[i].annotation
                    ));
                }
            }
        }
        callback(books);
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

const editBookInfo=(book)=> {
    let edited = false;
    let i = 0;
    while(i < books.length && books[i].id !== book.id) {
        i++;
    }
    if(i < books.length) {
        books[i] = book;
        edited = true;
    }
    mysql.editLightBook(book.id, book);
    return edited;
};

const deleteBook=(book)=> {
    let deleted = false;
    let i = 0;
    while(i < books.length && books[i].id !== book.id) {
        i++;
    }
    if(i < books.length) {
        books.splice(i, 1);
        deleted = true;
    }
    mysql.deleteLightBook(book.id);
    return deleted;
};

module.exports = {sortBooks, filterBooks, searchBookById, getAllBooks, createEmptyBook, editBookInfo, deleteBook};