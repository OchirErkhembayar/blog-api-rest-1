"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Router } = require("express");
const { body } = require('express-validator/check');
const postsController = require('../controllers/posts');
const router = Router();
router.get('/', postsController.getPosts);
router.get('/:postId', postsController.getPost);
router.post('/', [
    body('title')
        .trim()
        .isLength({ min: 1 }),
    body('content')
        .trim()
        .isLength({ min: 3 })
], postsController.postPost);
router.patch('/:postId', postsController.updatePost);
router.delete('/:postId', postsController.deletePost);
exports.default = router;
