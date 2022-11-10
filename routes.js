const router = require('express').Router();

const homeController = require('./controllers/home');
const authController = require('./controllers/auth');
const blogController = require('./controllers/blog');

router.use('/', homeController);
router.use('/auth', authController);
router.use('/blogs', blogController);
router.get('/*', (req, res) => {
    res.render('error/404');
})

module.exports = router;