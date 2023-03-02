'use strict';

const express = require('express');

const libraryController = require("../controllers/library_controller");

module.exports = function (options = {}) {
    const router = express.Router();
    router.get('',(req, res, next) => {
        console.log('a');
    });
    return router;
};

/*
const bookController = require("../controllers/book_controller");

module.exports = function (options = {}) {
    const router = express.Router();

    router.get('',(req, res, next) => {
        libraryController.getBooks(req, res);
    });
    router.post('/edit', (req, res, next) => {
        bookController.updateBook(req, res);
    });
    router.get('/edit', (req, res, next) => {
        libraryController.editBook(req, res);
    });/!*
    router.get('/add', (req, res, next) => {
        libraryController.editBook(req, res);
    });*!/
    router.post('/delete', (req, res, next) =>{
        libraryController.deleteBook(req, res);
    });
    router.post('/upload', (req, res, next)=>{
        bookController.saveImage(req, res);
    });
    return router;
};*/
