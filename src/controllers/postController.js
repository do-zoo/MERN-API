const {validationResult} = require('express-validator');
const fs = require('fs');
const path = require('path');
const BlogPost = require('../models/postModel');


exports.createBlogPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Invalid value, entered data is incorrect.');
        error.statusCode = 400;
        error.data = errors.array();
        throw error;
    }

    if (!req.file) {
        const error = new Error('No image provided. Please upload an image.');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const image = req.file.path;
    const content = req.body.content;

    const posting = new BlogPost({
        title: title,
        imagePath: image,
        content: content,
        // creator: req.userId,
        author: {
            uid: 1,
            name: 'Edward Edo'
        }
    });

    posting.save().then(result => {
        res.status(201).json({
            message: 'Post created successfully!',
            data: result
        });
    }).catch(err => {
        console.log("err :", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getAllBlogPost = (req, res, next) => {
    BlogPost.find().then(result => {
        res.status(200).json({
            message: 'All posts fetched successfully!',
            data: result
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getBlogPostById = (req, res, next) => {
    const postId = req.params.postId;

    BlogPost.findById(postId).then(result => {
        if (!result) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Post fetched successfully!',
            data: result
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.updateBlogPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Invalid value, entered data is incorrect.');
        error.statusCode = 400;
        error.data = errors.array();
        throw error;
    }

    if (!req.file) {
        const error = new Error('No image provided. Please upload an image.');
        error.statusCode = 422;
        throw error;
    }



    const postId = req.params.postId;
    const title = req.body.title;
    const image = req.file;
    const content = req.body.content;

    BlogPost.findById(postId).then(post => {
        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }

        if (title) {
            post.title = title;
        }

        if (image) {
            post.imagePath = image.path;
        }

        if (content) {
            post.content = content;
        }

        return post.save();
    }).then(result => {
        res.status(200).json({
            message: 'Post updated successfully!',
            data: result
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.deleteBlogPost = (req, res, next) => {
    const postId = req.params.postId;

    BlogPost.findById(postId).then(post => {
        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }

        fs.unlink(path.join(__dirname, '../..', post.imagePath), err => {
            if (err) {
                console.log(err);
            }
        });

        return BlogPost.findByIdAndRemove(postId);
    }).then(result => {
        res.status(200).json({
            message: 'Post deleted successfully!',
            data: result
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}