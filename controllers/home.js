const router = require('express').Router();

const blogServices = require('../services/blog');

router.get('/', async (req, res) => {
    let allBlogs = await blogServices.getAll();
    res.render('home/home', { allBlogs });
});



module.exports = router;