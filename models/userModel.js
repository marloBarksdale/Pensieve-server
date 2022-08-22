import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Image from './imageModel.js';

const userSchema = mongoose.Schema({
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, unique: true },
  password: { type: String, required: true },
  tokens: [{ token: { type: String, required: true } }],
  avatar: { type: mongoose.Types.ObjectId, ref: 'Image' },
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'author',
  localField: '_id',
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    //Hash new passwords
    user.password = await bcrypt.hash(user.password, 12);
  }

  if (user.isModified('avatar')) {
    //If the user model has a valid avatar field then place the user id on the imagge "user" field
    if (mongoose.isValidObjectId(user.avatar)) {
      const image = await Image.findById(user.avatar);
      image.user = user._id;
      await image.save();
    }
  }

  if (user.isModified('tokens')) {
    //Clear tokens whenevr the user model is saved and tokens have been modified
    user.tokens = user.tokens.filter((token) => {
      return (
        Math.floor(new Date().getTime() / 1000) < jwt.decode(token.token).exp
      );
    });
  }

  next();
});
const User = mongoose.model('User', userSchema);

export default User;
