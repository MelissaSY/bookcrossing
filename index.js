'use strict';

const mysql = require('./storage_managment/mysql_manager');
const express = require('express');
const about = require('./routes/about_bookcrossing');
const books = require('./routes/books');
const hunt = require('./routes/hunt');
const places = require('./routes/places');
const main_page = require('./routes/main_page');
const touring_books = require('./routes/touring_books');
const authors = require('./routes/authors');

const app = express();

app.set('view engine', 'ejs');

mysql.createDB('books');
mysql.createLightBookTable();
mysql.createAuthorsTable();
mysql.createTransAuthorBook();

app.use(express.json())
    .use(express.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/images', express.static(__dirname + '/images'));


app.use('/about', about())
    .use('/books', books())
    .use('/places', places())
    .use('/hunt', hunt())
    .use('/touring_books', touring_books())
    .use('/authors', authors())
    .use('/', main_page());
app.listen(8080, 'localhost');