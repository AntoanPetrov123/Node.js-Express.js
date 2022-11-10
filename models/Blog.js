const mongoose = require('mongoose');

let blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    image: {
        type: String,
        required: true,
        validate: /^(https|http)?:\/\//i
    },
    content: {
        type: String,
        required: true,
        minLength: 10,
    },
    category: {
        type: String,
        required: true,
        minLength: 3,
    },
    followList: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

blogSchema.method('getFollowed', () => {
    return this.followList;
});




let Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;