'use strict';
const express = require('express');
module.exports = function (options = {}) {
  const router = express.Router();
  router.get('',(req, res, next) => {
     res.render('main_page');
  });
  return router;
};