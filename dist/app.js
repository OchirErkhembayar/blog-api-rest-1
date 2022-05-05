"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const blog_1 = __importDefault(require("./routes/blog"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/posts', blog_1.default);
app.use('/auth', auth_1.default);
mongoose.connect(`${process.env.MONGO_DB_THING}`)
    .then(() => {
    console.log('Database connected.');
    app.listen(8000);
})
    .catch((err) => {
    console.log('Database failed to connect.', err);
});
