import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { required: true, type: String },
    author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, default: 'post message' },
  },
  { timestamps: true },
);

const Post = mongoose.model('Post', postSchema);

export default Post;
