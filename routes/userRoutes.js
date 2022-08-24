import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import {
  deleteAvatar,
  login,
  logout,
  signup,
  update,
  getUsers,
} from '../controllers/userControllers.js';
const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', auth, logout);

router.delete('/avatar', auth, deleteAvatar);

router.get('/', getUsers);

router.patch('/', auth, update);

export default router;
