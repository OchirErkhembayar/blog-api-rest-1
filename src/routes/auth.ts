import mongoose from "mongoose";

const { Router } = require('express');
const { body } = require('express-validator/check')

import User from "../models/user";
const authController = require('../controllers/auth');

const router = Router();

router.post('/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value: string, { req }: any) => {
        return User.findOne({ email: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('E-Mail address is already taken.')
            }
          })
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 6 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);

export default router;
