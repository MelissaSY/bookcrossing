'use strict';

const express = require('express');

const authorController = require("../controllers/author_controller");
const library = require("../entities/library");
const libraryController = require("../controllers/library_controller");

module.exports = function(options={}) {
    const router = express.Router();
    router.get("/", (req, res, next)=>{
        libraryController.getAuthors(req, res);
    });
    router.get("/add", (req, res, next) => {
        libraryController.addAuthor(req, res);
    });
    router.get("/edit", (req, res, next)=>{
        libraryController.editAuthor(req, res);
    });
    router.post("/edit", (req, res, next)=>{
        authorController.saveChanges(req, res);
    });
    router.post("/delete", (req, res, next) => {
        libraryController.deleteAuthor(req, res);
    });
    return router;
};