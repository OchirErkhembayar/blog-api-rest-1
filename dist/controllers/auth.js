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
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_1 = __importDefault(require("../models/user"));
// type RequestParams = { postId: string };
exports.signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Invalid signup details",
            errors: errors
        });
    }
    try {
        const body = req.body;
        const email = body.email;
        const password = body.password;
        const name = body.name;
        const hashedPw = yield bcrypt.hash(password, 12);
        const user = new user_1.default({
            email: email,
            password: hashedPw,
            name: name
        });
        const newUser = yield user.save();
        res.status(201).json({
            message: "User created.",
            userId: newUser._id.toString()
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to create user"
        });
    }
});
exports.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const email = body.email;
        const password = body.password;
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }
        const isEqual = yield bcrypt.compare(password, user.password);
        if (!isEqual) {
            return res.status(401).json({
                message: "Wrong password."
            });
        }
        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        }, `${process.env.PRIVATE_JWT_KEY}`, { expiresIn: '1h' });
        res.status(200).json({
            token: token,
            userId: user._id.toString()
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to login."
        });
    }
});
