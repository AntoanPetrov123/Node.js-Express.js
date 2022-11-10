const jwt = require('../utils/jwt');
const User = require('../models/User');

exports.findUser = (userId) => User.findById({ "_id": userId });

exports.register = (userData) => User.create(userData);

exports.login = async ({ email, password }) => {
    let user = await User.findOne({ email });
    console.log(user.password);
    if (!user) {
        throw new Error('Invalid email or password');
    };

    let isValid = await user.comparePasswords(password, user.password);

    if (!isValid) {
        throw new Error('Invalid email or password');
    }

    let payload = {
        _id: user._id,
        email: user.email,
        username: user.username,
        ownList: user.ownList,
        followList: user.followList,
    }

    let token = await jwt.sign(payload, 'superSicretJWToken');

    return token;
}