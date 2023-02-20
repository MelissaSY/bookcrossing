'use strict';
const express = require('express');
module.exports = function (options = {}) {
    const router = express.Router();
    const {service} = options;

    router.get('',(req, res, next) => {
        res.render(
            'main_page', {
                title: 'Book-crossingꚎ̆'
            }
        );
    });
    return router;
};