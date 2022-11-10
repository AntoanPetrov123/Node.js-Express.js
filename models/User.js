const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        minLength: 2,
    },
    email: {
        type: String,
        require: true,
        minLength: 10,
    },
    password: {
        type: String,
        require: true,
        minLength: 4,
    },
});

userSchema.pre('save', function (next) {
    return bcrypt.hash(this.password, SALT_ROUNDS)
        .then((hash) => {
            this.password = hash;

            return next();
        });
});

userSchema.method('comparePasswords', (password, userPass) => {


    return bcrypt.compare(password, userPass);


});

// blogSchema.method('getOwn', () => {
//     console.log(this.owner);
//     return this.owner;
// })

const User = mongoose.model('User', userSchema);

module.exports = User;