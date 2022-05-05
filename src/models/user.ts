import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface IUser {
  name: string;
  email: string;
  password: string;
  posts: object[]
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
},
{ timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
