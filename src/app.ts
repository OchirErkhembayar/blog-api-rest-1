const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

import blogRoutes from './routes/blog';
import authRoutes from './routes/auth';

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/posts', blogRoutes);
app.use('/auth', authRoutes);

mongoose.connect(`${process.env.MONGO_DB_THING}`)
  .then(() => {
    console.log('Database connected.');
    app.listen(8000);
  })
  .catch((err: Error) => {
    console.log('Database failed to connect.', err);
  });
