import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;

    if (req.params.id)
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Not found');

    next();
  } catch (error) {
    res.status(401).send({ error: 'Please Authenticate' });
  }

  //console.log('middlewear');
};
