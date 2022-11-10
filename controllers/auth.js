const router = require('express').Router();
const authServices = require('../services/auth');
const blogServices = require('../services/blog');

const { isGuest, isAuth } = require('../middlewares/auth');

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login', { title: 'Login Page' });
});

router.post('/login', isGuest, async (req, res) => {
    const { email, password } = req.body;

    try {
        let token = await authServices.login({
            email,
            password
        });

        res.cookie('auth_jwt', token);
        res.redirect('/');
    } catch (error) {
        res.render('auth/login', { error: error.message });
    }

});

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register', { title: 'Register Page' });
});

router.post('/register', isGuest, async (req, res) => {
    const { username, email, password, confPass } = req.body;

    if (password !== confPass) {
        res.locals.error = 'Passwords or Email do not match!'
        return res.render('auth/register')
    };

    try {

        await authServices.register({
            username,
            email,
            password
        });

        let token = await authServices.login({
            email,
            password
        });

        res.cookie('auth_jwt', token);
        res.redirect('/');
    } catch (error) {
        res.render('auth/register', { error: getErrorMessage(error) });
    }

});
router.get('/profile', isAuth, async (req, res) => {
    const userId = req.user._id;
    let followed = await blogServices.getMyFollowBlog(userId);
    let own = await blogServices.getMyCreatedBlog(userId);
    res.render('auth/profile', { title: 'Profile', own, followed });
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth_jwt');
    res.redirect('/');
});

function getErrorMessage(error) {

    let errorsArr = Object.keys(error.errors);

    if (errorsArr.length > 0) {
        return error.errors[errorsArr[0]];
    } else {
        return error.message
    }

}

module.exports = router;