import Post from "../models/post";
import User from "../models/user";

const { validationResult } = require('express-validator/check');

type RequestBody = { title: string, content: string, author: string };
type RequestParams = { postId: string };

exports.getPosts = async (req: any, res: any, next: any) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      message: 'Posts returned successfully.',
      posts: posts
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Failed to fetch posts.'
    });
  }
};

exports.getPost = async (req: any, res: any, next: any) => {
  try {
    const params = req.params as RequestParams;
    const post = await Post.findById(params.postId);
    res.status(200).json({
      message: "Post successfully retrieved.",
      post: post
    })
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: 'Could not find post.'
    })
  }
}

exports.postPost = async (req: any, res: any, next: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed. Input is incorrect.",
        errors: errors
      })
    }
    const body = req.body as RequestBody;
    const user = await User.findById({ _id: body.author })
    if (!user) {
      return res.status(422).json({
        message: "User not found."
      })
    }
    const newPost = new Post({
      title: body.title,
      content: body.content,
      author: user
    });
    await newPost.save();
    user.posts.push(newPost);
    await user.save();
    res.status(201).json({
      message: 'New post successfully saved.',
      post: newPost
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Failed to create post.'
    });
  }
}

exports.updatePost = async (req: any, res: any, next: any) => {
  try {
    const params = req.params as RequestParams;
    const body = req.body as RequestBody;
    const post = await Post.findById(params.postId);
    if (post) {
      if (body.content) {
        post.content = body.content;
        await post.save();
      }
    }
    res.status(201).json({
      message: "Post successfully updated",
      post: post
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not update post."
    });
  }
};

exports.deletePost = async (req: any, res: any, next: any) => {
  try {
    const params = req.params as RequestParams;
    await Post.findByIdAndDelete(params.postId);
    res.json({
      message: "Deleted post."
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not delete post."
    });
  }
};
