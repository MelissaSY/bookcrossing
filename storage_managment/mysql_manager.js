'use strict';
const mysql = require('mysql2');

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0852369QSC(",
});
const createDB=(dbName)=> {
    connection.connect(function(err){
    if (err) {
        return console.error(err.message);
    }
    else {
        let sql = `CREATE DATABASE IF NOT EXISTS ${dbName}`;
        connection.query(sql, function (err, result) {
            if (err) {
                return console.error(err.message);
            }
        });
    }
});};


const createTable=(db, table_name, sql_query)=> {
    let sql =`USE ${db}`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
    });
    sql =`SHOW TABLES LIKE '${table_name}'`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error("show tables", err.message);
        }
        if(result.length === 0) {
            sql = `CREATE TABLE ${table_name} (${sql_query})`;
            connection.query(sql, function (err, result) {

                if (err) {
                    return console.error("CREATE TABLE", err.message);
                }
            });
        }
    });
};

const createLightBookTable=()=>{  
   let sql = `id_book INT PRIMARY KEY, 
        title VARCHAR(255), 
        isbn VARCHAR(13), annotation LONGTEXT, 
        genres LONGTEXT, has_image BOOLEAN, filepath MEDIUMTEXT`;
            
    createTable('books', 'light_book', sql);
};

const createAuthorsTable=()=> {
    let sql = `id_author INT PRIMARY KEY, name VARCHAR(255), surnaname VARCHAR(255), 
    pseudonym VARCHAR(255), patronymic VARCHAR(255)`;
    
    createTable('books', 'author', sql);

};

const createTransAuthorBook=()=>{
    let sql = `
        id_book INT, id_author INT,
        FOREIGN KEY (id_book) REFERENCES light_book (id_book) ON DELETE CASCADE,
        FOREIGN KEY (id_author) REFERENCES author (id_author) ON DELETE CASCADE
        `;
    
    createTable('books', 'book_author', sql);
};

const addLightBook=(book)=>{
    let sql=`INSERT INTO light_book(id_book, title, isbn, annotation, genres, has_image, filepath)
 VALUES (${book.id}, '${book.title}', '${book.isbn}', '${book.annotation}', '${book.genres}', ${book.hasimage}, '${book.filepath}')`;
    connection.query(sql, function (err, result) {
      if (err) {
            return console.error(err.message);
      }
    });
};

const addAuthor=(author)=> {
    let sql=`INSERT INTO author(id_author, name, surname, pseudonym, patronymic)
 VALUES (${author.id}, '${author.name}', '${author.surname}', '${author.pseudonym}', '${author.patronymic}')`;
    connection.query(sql, function (err, result) {
      if (err) {
            return console.error(err.message);
      }
    });
};

const createAuthorBookConnection=(authorId, bookId) => {
    let sql =`INSERT INTO book_author(id_book, id_author)
    VALUES (${bookId}, ${authorId})`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
    });
};

const deleteAuthorBookConnection = (authorId, bookId) => {
    let sql =`DELETE FROM book_author WHERE id_book = ${bookId} AND id_author = ${authorId}`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
    });
};

const deleteAuthorBookAuthorConnection = (authorId) => {
    let sql =`DELETE FROM book_author WHERE id_author = ${authorId}`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
    });
};

const deleteAuthorBookBookConnection = (bookId) => {
    let sql =`DELETE FROM book_author WHERE id_book = ${bookId}`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
    });
};


const getBookAuthors=(bookId, callback) => {
    let sql = `SELECT * FROM book_author WHERE id_book = ${bookId}`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
        return callback(result);
    });
};

const getBookAuthorConnections=(callback) => {
    let sql = `SELECT * FROM book_author`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
        return callback(result);
    });
};

const deleteAuthor=(id)=> {
    let sql =`DELETE FROM author WHERE id_author = ${id}`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
    });
};

const deleteLightBook=(id)=> {
    let sql =`DELETE FROM light_book WHERE id_book = ${id}`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
    });
};

const editLightBook=(id, book)=>{
    let sql =`UPDATE light_book SET title = '${book.title}', isbn = '${book.isbn}', annotation = '${book.annotation}', genres = '${book.genres}',
    has_image = ${book.hasimage}, filepath = '${book.filepath}' WHERE id_book = ${id}`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
    });
};

const editAuthor=(author)=>{
    let sql =`UPDATE author SET name = '${author.name}', 
    surname = '${author.surname}', pseudonym = '${author.pseudonym}', patronymic = '${author.patronymic}' 
    WHERE id_author = ${author.id}`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
    });
};

const updateOrAddAuthor=(author)=> {
    let sql =`SELECT * FROM author WHERE id_author = ${author.id}`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
        if(result.length > 0) {
            editAuthor(author);
        } else {
            addAuthor(author);
        }
    });
};

const updateOrAddLightBook=(book, callback)=> {
    let sql =`SELECT * FROM light_book  WHERE id_book = ${book.id}`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
        if(result.length > 0) {
            editLightBook(book.id, book);
        } else {
            addLightBook(book);
        }
        callback();
    });
};

const getAllLightBooks=(callback)=> {
    let sql = 'SELECT * FROM light_book';
    connection.query(sql, function (err, result) {
        if (err) {
            console.error(err.message);
            return null;
        }
        return callback(result);
    });
};
const getAllAuthors=(callback) => {
    let sql = 'SELECT * FROM author';
    connection.query(sql, function (err, result) {
        if (err) {
            console.error(err.message);
            return null;
        }
        return callback(result);
    });
};

module.exports = {createDB, createAuthorsTable, createTransAuthorBook, 
    createLightBookTable, addLightBook, addAuthor, deleteAuthor, updateOrAddAuthor,
    deleteLightBook, updateOrAddLightBook, editAuthor,
    editLightBook, getAllLightBooks, getAllAuthors, 
    
    createAuthorBookConnection, 
    deleteAuthorBookConnection, deleteAuthorBookAuthorConnection, deleteAuthorBookBookConnection, 
    getBookAuthors, getBookAuthorConnections};

