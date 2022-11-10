const mongoose = require('mongoose');

let initDatabase = () => {
    return mongoose.connect('mongodb://localhost:27017/mind-blog');
}

module.exports = initDatabase;