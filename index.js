'use strict';

const mysql = require('./storage_managment/mysql_manager');
const express = require('express');
const about = require('./middleware/about_bookcrossing');
const books = require('./middleware/books');
const hunt = require('./middleware/hunt');
const places = require('./middleware/places');
const main_page = require('./middleware/main_page');

const app = express();

app.set('view engine', 'ejs');

mysql.createDB('books');
mysql.createLightBookTable();

app.use(express.json())
    .use(express.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

app.use('/about', about())
    .use('/books', books())
    .use('/places', places())
    .use('/hunt', hunt())
    .use('/', main_page());
app.listen(8080, 'localhost');