"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Router } = require('express');
const { body } = require('express-validator/check');
const user_1 = __importDefault(require("../models/user"));
const authController = require('../controllers/auth');
const router = Router();
router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
        return user_1.default.findOne({ email: value })
            .then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-Mail address is already taken.');
            }
        });
    })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 6 }),
    body('name')
        .trim()
        .not()
        .isEmpty()
], authController.signup);
router.post('/login', authController.login);
exports.default = router;
