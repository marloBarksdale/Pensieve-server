import express from 'express';
import '../index.js';

import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from '../controllers/postControllers.js';
import { auth } from '../middleware/auth.js';
// import { upload } from '../index.js';

const router = express.Router();

router.post('/', addPost);

router.get('/', auth, getPosts);

router.get('/:id', auth, getPost);

router.patch('/:id', auth, updatePost);

router.delete('/:id', auth, deletePost);

export default router;
