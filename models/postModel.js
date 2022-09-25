import mongoose from 'mongoose';
import Image from './imageModel.js';

const postSchema = new mongoose.Schema(
  {
    title: { required: true, type: String },
    author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    text: { type: String },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    image: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Image',
    },
  },
  { timestamps: true },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true,
});

postSchema.pre('save', async function (next) {
  const post = this;

  if (post.isModified('image')) {
    //If the post model has a valid avatar field then place the post id on the image "post" field
    if (mongoose.isValidObjectId(post.image)) {
      const image = await Image.findById(post.image);
      image.post = post._id;
      await image.save();
    }
  }

  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;
