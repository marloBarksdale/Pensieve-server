import mongoose from 'mongoose';

var commentSchema = new mongoose.Schema(
  {
    message: String,
    post: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
    parent: { type: mongoose.Types.ObjectId, ref: 'Comment' },
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
  },

  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent',
});
const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
