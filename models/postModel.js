import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { required: true, type: String },
  author: { type: String, ref: 'User', required: true },
});

const Post = mongoose.model('Post', postSchema);

export default Post;
