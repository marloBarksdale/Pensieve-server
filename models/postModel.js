import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { required: true, type: String },
    author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

const Post = mongoose.model('Post', postSchema);

export default Post;
