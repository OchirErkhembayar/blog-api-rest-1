import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = require('./user');

interface IPost {
  title: string;
  content: string;
  author: object;
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Object,
    required: String
  }
},
{ timestamps: true  });

export default mongoose.model<IPost>('Post', postSchema);
