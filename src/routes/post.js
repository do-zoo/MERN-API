const express = require("express");
const {body} = require("express-validator");

const router = express.Router();

const postController = require("../controllers/postController");

// ROUTES
router.post("/post", 
    [
        body('title').isLength({min: 5}).withMessage('Title must be at least 5 chars long'), 
        body('content').isLength({min: 5}).withMessage('Content must be at least 5 chars long')
    ],
    postController.createBlogPost);

router.get("/posts", postController.getAllBlogPost);
router.get("/post/:postId", postController.getBlogPostById);
router.put("/post/:postId",
    [
        body('title').isLength({min: 5}).withMessage('Title must be at least 5 chars long'),
        body('content').isLength({min: 5}).withMessage('Content must be at least 5 chars long')
    ],
    postController.updateBlogPost);

router.delete("/post/:postId", postController.deleteBlogPost);

module.exports = router;

module.exports = router;