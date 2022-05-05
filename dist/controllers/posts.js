"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const { validationResult } = require('express-validator/check');
exports.getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find();
        res.status(200).json({
            message: 'Posts returned successfully.',
            posts: posts
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to fetch posts.'
        });
    }
});
exports.getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.params;
        const post = yield post_1.default.findById(params.postId);
        res.status(200).json({
            message: "Post successfully retrieved.",
            post: post
        });
    }
    catch (error) {
        console.log(error);
        res.status(404).json({
            message: 'Could not find post.'
        });
    }
});
exports.postPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: "Validation failed. Input is incorrect.",
                errors: errors
            });
        }
        const body = req.body;
        const user = yield user_1.default.findById({ _id: body.author });
        if (!user) {
            return res.status(422).json({
                message: "User not found."
            });
        }
        const newPost = new post_1.default({
            title: body.title,
            content: body.content,
            author: user
        });
        yield newPost.save();
        user.posts.push(newPost);
        yield user.save();
        res.status(201).json({
            message: 'New post successfully saved.',
            post: newPost
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to create post.'
        });
    }
});
exports.updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.params;
        const body = req.body;
        const post = yield post_1.default.findById(params.postId);
        if (post) {
            if (body.content) {
                post.content = body.content;
                yield post.save();
            }
        }
        res.status(201).json({
            message: "Post successfully updated",
            post: post
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Could not update post."
        });
    }
});
exports.deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.params;
        yield post_1.default.findByIdAndDelete(params.postId);
        res.json({
            message: "Deleted post."
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Could not delete post."
        });
    }
});
