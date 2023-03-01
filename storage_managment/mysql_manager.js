'use strict';
const mysql = require('mysql2');

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0852369QSC(",
    //database:"book_crossing"
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
const createLightBookTable=()=>{
    let sql =`USE books`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
    });
    sql =`SHOW TABLES LIKE 'light_book'`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error("show tables", err.message);
        }
        if(result.length === 0) {
            sql = `CREATE TABLE light_book (id_book INT PRIMARY KEY, title VARCHAR(255), author LONGTEXT, 
isbn VARCHAR(13), annotation LONGTEXT, genres LONGTEXT, has_image BOOLEAN, filepath MEDIUMTEXT)`;
            connection.query(sql, function (err, result) {

                if (err) {
                    return console.error("CREATE TABLE light_book", err.message);
                }
            });
        }
    });
};
const addLightBook=(book)=>{
    let sql=`INSERT INTO light_book(id_book, title, author, isbn, annotation, genres, has_image, filepath)
 VALUES (${book.id}, '${book.title}', '${book.author}', '${book.isbn}', '${book.annotation}', '${book.genres}', ${book.hasimage}, '${book.filepath}')`;
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
    let sql =`UPDATE light_book SET title = '${book.title}', author = '${book.author}', isbn = '${book.isbn}', annotation = '${book.annotation}', genres = '${book.genres}',
    has_image = ${book.hasimage}, filepath = '${book.filepath}' WHERE id_book = ${id}`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.error(err.message);
        }
    });
};

const updateOrAddLightBook=(book)=> {
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
const createTables=()=>{
    connection.connect(function(err) {
        let sql = 'CREATE TABLE books (id_book INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), annotation LONGTEXT)';
        connection.query(sql, function (err, result) {

            if (err) {
                return console.error(err.message);
            }
        });
        sql = 'CREATE TABLE authors (id_author INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), surname VARCHAR(255), ' +
            'patronymic VARCHAR(255), pseudonym VARCHAR(255))';
        connection.query(sql, function (err, result) {
            if (err) {
                return console.error(err.message);
            }
        });
        sql = 'CREATE TABLE genres (id_genre INT AUTO_INCREMENT PRIMARY KEY, name_genre VARCHAR(255))';
        connection.query(sql, function (err, result) {
            if (err) {
                return console.error(err.message);
            }
        });
        sql = 'CREATE TABLE book_copies (id_book_copy INT AUTO_INCREMENT PRIMARY KEY, id_book INT, current_status INT)';
        connection.query(sql, function (err, result) {
            if (err) {
                return console.error(err.message);
            }
        });
        sql = 'CREATE TABLE statuses (id_status INT AUTO_INCREMENT PRIMARY KEY, status_name VARCHAR(45))';
        connection.query(sql, function (err, result) {
            if (err) {
                return console.error(err.message);
            }
        });
    });
};
const createTransTables=()=> {
    connection.connect(function(err) {
        let sql = 'CREATE TABLE author_book (id_book INT FOREIGN KEY, id_author INT FOREIGN KEY)';
        connection.query(sql, function (err, result) {

            if (err) {
                return console.error(err.message);
            }
        });
        sql = 'CREATE TABLE genre_book (id_book INT FOREIGN KEY, id_genre INT FOREIGN KEY)';
        connection.query(sql, function (err, result) {

            if (err) {
                return console.error(err.message);
            }
        });
    });
};

const addAuthor=(author)=> {
    connection.connect(function(err) {
        let sql = 'INSERT INTO authors (id_author INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), surname VARCHAR(255), ' +
        'patronymic VARCHAR(255), pseudonym VARCHAR(255))';
        connection.query(sql, function (err, result) {
            if (err) {
                return console.error(err.message);
            }
        });
    });
};

module.exports = {createDB, createTables, createTransTables, createLightBookTable, addLightBook,
    deleteLightBook, updateOrAddLightBook, editLightBook, getAllLightBooks};

