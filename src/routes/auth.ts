import express from 'express'
import { login } from '../controllers/auth/authController'
import authMiddleware from '../middlewares/middleware'

const router = express.Router();

router.post('/login',login);
// router.get('/verify',authMiddleware,verify);

export default router;