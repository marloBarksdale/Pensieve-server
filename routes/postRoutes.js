import express from 'express';
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from '../controllers/postControllers.js';
import { auth } from '../middleware/auth.js';
import Post from '../models/postModel.js';

const router = express.Router();

router.post('/', auth, addPost);

router.get('/', auth, getPosts);

router.get('/:id', auth, getPost);

router.patch('/:id', auth, updatePost);

router.delete('/:id', auth, deletePost);

export default router;
