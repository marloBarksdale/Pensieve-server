import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const user = await new User(req.body).save();

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
