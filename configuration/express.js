const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const { auth } = require('../middlewares/auth');

function expressConfig(app) {
    app.locals.title = 'Mind Blog'
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(auth);
}

module.exports = expressConfig;