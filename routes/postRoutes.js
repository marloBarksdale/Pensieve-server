import express from 'express';
import { auth } from '../middleware/auth.js';
import Post from '../models/postModel.js';

const router = express.Router();

router.post('/', auth, async (req, res, next) => {
  try {
    const post = await new Post({ ...req.body, author: req.user._id }).save();

    res.status(201).send(post);
  } catch (error) {
    res.status(400).status(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Post.find();

    res.status(200).send(tasks);
  } catch (error) {}
});

export default router;
