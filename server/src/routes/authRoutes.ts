import { Router } from 'express';
import { login, refreshToken } from '../controllers/authController';
// import { login, refreshToken } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.get('/refresh', refreshToken);

export default router;
