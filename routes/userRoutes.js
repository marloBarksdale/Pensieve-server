import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
const router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const user = await new User(req.body).save();

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });

    const loggedIn = await bcrypt.compare(req.body.password, user.password);

    if (loggedIn) {
      const token = await user.generateAuthToken();

      res.status(200).send({ user, token });
    } else {
      res.status(400).send('Could not find user');
    }
  } catch (error) {}
});

export default router;
