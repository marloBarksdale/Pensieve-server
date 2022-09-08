import express from 'express';
import '../index.js';

import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
  likePost,
} from '../controllers/postControllers.js';
import { auth } from '../middleware/auth.js';
// import { upload } from '../index.js';

const router = express.Router();

router.post('/', addPost);

router.get('/', getPosts);

router.get('/:id', getPost);

router.patch('/:id', updatePost);

router.patch('/:id/like', likePost);

router.delete('/:id', deletePost);

export default router;
