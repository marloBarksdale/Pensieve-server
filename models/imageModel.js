import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
    },
    imageKey: { type: String },
    post: { type: mongoose.Types.ObjectId, ref: 'Post' },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Image = mongoose.model('Image', imageSchema);

export default Image;
