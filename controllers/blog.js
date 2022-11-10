const router = require('express').Router();

const authServices = require('../services/auth');
const blogServices = require('../services/blog');
const { isAuth } = require('../middlewares/auth');

let isOwner = async (req, res, next) => {
    let blog = await blogServices.getOne(req.params.blogId);

    if (blog.owner == req.user._id) {
        res.redirect(`/blogs/${req.params.blogId}/details`);
    } else {
        next();
    }
}

let checkIsOwner = async (req, res, next) => {
    let blog = await blogServices.getOne(req.params.blogId);

    if (blog.owner == req.user._id) {
        next();
    } else {
        res.redirect(`/blogs/${req.params.blogId}/details`);
    }
}

router.get('/catalog', async (req, res) => {
    let allBlogs = await blogServices.getAll();
    res.render('blogs/catalog', { title: 'Blog Catalog', allBlogs });
});

router.get('/create-blog', isAuth, (req, res) => {
    res.render('blogs/create', { title: 'Create Blog' });
});

router.post('/create-blog', isAuth, async (req, res) => {
    try {
        await blogServices.create({ ...req.body, owner: req.user._id });
        res.redirect('/blogs/catalog');
    } catch (error) {
        res.render('blogs/create', { error: getErrorMessage(error) })
    }
});

let getErrorMessage = (error) => {
    console.log(error);
    let errorsArr = Object.keys(error.errors);

    if (errorsArr.length > 0) {
        return error.errors[errorsArr[0]];
    } else {
        return error.message
    }

}

router.get('/:blogId/details', async (req, res) => {
    let blog = await blogServices.getOne(req.params.blogId);
    let blogData = blog.toObject();
    let isOwner = blogData.owner == req.user?._id;

    let followed = blog.followList;
    let followedEmails = [];
    // followed.forEach(id => console.log(id.toString()));

    followed.forEach(id => {
        // let currentId = id.toString();
        // let currentUser = authServices.findUser(currentId);
        followedEmails.push(id);
    });

    let isFollowed = req.user && followed.some(f => f._id == req.user?._id);
    let showButton = !isFollowed;

    console.log(followedEmails);


    res.render('blogs/details', { ...blogData, isOwner, showButton, followedEmails });
});

router.get('/:blogId/edit', checkIsOwner, async (req, res) => {
    const blogId = req.params.blogId
    let blog = await blogServices.getOne(blogId);
    res.render('blogs/edit', { ...blog.toObject() })
});

router.post('/:blogId/edit', checkIsOwner, async (req, res) => {
    try {
        const blogId = req.params.blogId;
        console.log(req.body);
        const blogData = req.body;
        await blogServices.update(blogId, blogData);
        res.redirect(`/blogs/${blogId}/details`);
    } catch (error) {
        res.render('blogs/edit', { error: getErrorMessage(error) })
    }
});

router.get('/:blogId/follow', isOwner, async (req, res) => {
    const blogId = req.params.blogId
    let blog = await blogServices.getOne(blogId);

    blog.followList.push(req.user._id);
    await blog.save();
    res.redirect(`/blogs/${req.params.blogId}/details`);
});

router.get('/:blogId/delete', checkIsOwner, async (req, res) => {
    const blogId = req.params.blogId;
    await blogServices.delete(blogId);
    res.redirect('/blogs/catalog');
});


module.exports = router;