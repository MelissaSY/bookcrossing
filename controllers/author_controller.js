'use strict';
const library = require("../entities/library");
const Author = require('../entities/author');

const saveChanges = (req, res) => {
    let author = new Author(
        parseInt(req.body.id), req.body.pseudonym, req.body.name, req.body.surname, req.body.patronymic
    );
    library.editAuthorInfo(author);
    res.redirect('/authors');
};  
module.exports={saveChanges};