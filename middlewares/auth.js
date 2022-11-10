const jwt = require('../utils/jwt');

exports.auth = (req, res, next) => {
    let token = req.cookies['auth_jwt'];

    if (token) {
        jwt.verify(token, 'superSicretJWToken')
            .then(decodedToken => {
                req.user = decodedToken;
                res.locals.user = decodedToken;
                next();
            })
            .catch(err => {
                res.clearCookie('auth_jwt');
                res.status(401).render('404');
            })
    } else {
        next();
    }
}

exports.isAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.render('auth/login')
    }
}

exports.isGuest = (req, res, next) => {
    if (!req.user) {
        next();
    } else {
        res.redirect('/');
    }
}