const Blog = require('../models/Blog');


exports.getAll = () => Blog.find().lean();
exports.getOne = (blogId) => Blog.findById(blogId);


exports.getMyCreatedBlog = (userId) => Blog.find({ owner: userId }).lean();
exports.getMyFollowBlog = (userId) => Blog.find({ followList: userId }).lean();

exports.create = (blogData) => Blog.create(blogData);
exports.update = (blogId, blogData) => Blog.findByIdAndUpdate(blogId, blogData);
exports.delete = (blogId) => Blog.findByIdAndDelete(blogId);

