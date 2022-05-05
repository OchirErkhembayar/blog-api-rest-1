const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

import User from "../models/user";

type RequestBody = { email: string, password: string, name: string };
// type RequestParams = { postId: string };

exports.signup = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid signup details",
      errors: errors
    })
  }
  try {
    const body = req.body as RequestBody;
    const email = body.email;
    const password = body.password;
    const name = body.name;
    const hashedPw = await bcrypt.hash(password, 12)
    const user = new User({
      email: email,
      password: hashedPw,
      name: name
    })
    const newUser = await user.save();
    res.status(201).json({
      message: "User created.",
      userId: newUser._id.toString()
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Failed to create user"
    })
  }
}

exports.login = async (req: any, res: any, next: any) => {
  try {
    const body = req.body as RequestBody;
    const email = body.email;
    const password = body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "User not found."
      });
    }
    const isEqual = await bcrypt.compare(password, user.password);
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
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to login."
    })
  }
}
