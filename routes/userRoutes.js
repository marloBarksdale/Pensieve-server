import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { login, logout, signup } from '../controllers/userControllers.js';
const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', auth, logout);

export default router;
