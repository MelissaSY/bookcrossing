'use strict';

const mysql = require('../storage_managment/mysql_manager');
let Book = require ("./light_book.js");

let books = [];

const createNoAdd=()=>{
    let id = getNextId();
    let book = new Book(id, '', '');
    books.push(book);
    return book;
};
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
        if(books[i][selectedFilter].toLowerCase().includes(filterValue.toLowerCase())) {
            filtered.push(books[i]);
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

const getAllBooks=(callback) => {
    books.length = 0;
    mysql.getAllLightBooks(function (result) {
        if(result !== null) {
            for(let i =0; i < result.length; i++) {
                let oldBook= searchBookById(result[i].id_book);
                if(oldBook === null) {
                    books.push(new Book(result[i].id_book,
                        result[i].title, result[i].author, result[i].genres,
                        result[i].isbn, result[i].annotation, result[i].filepath, result[i].has_image
                    ));
                } else {
                    oldBook.title = result[i].title;
                    oldBook.author = result[i].author;
                    oldBook.genres = result[i].genres;
                    oldBook.isbn = result[i].isbn;
                    oldBook.annotation = result[i].annotation;
                    oldBook.filepath = result[i].filepath;
                    oldBook.hasimage = result[i].has_image;
                    editBookInfo(oldBook);
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

const getNextId=() => {
  let maxId = -1;
  for(let book of books) {
      if(book.id > maxId) {
          maxId = book.id;
      }
  }
  maxId++;
  return maxId;
};

const editBookInfo=(book)=> {
    temporaryEdit(book);
    mysql.updateOrAddLightBook(book);
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

const temporaryEdit=(book)=> {
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

module.exports = {temporaryEdit, createNoAdd, sortBooks, filterBooks, searchBookById, getAllBooks, createEmptyBook, editBookInfo, deleteBook};