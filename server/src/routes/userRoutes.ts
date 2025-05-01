import { Router } from 'express';
import { addUser, deleteUser, getUserDetails, listUsers, updateUser } from '../controllers/userController';
import { verifyTokenMiddleware } from '../middlewares/verifyToken';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.post('/add', verifyTokenMiddleware, requireRole(['admin']), addUser);
router.get('/list', verifyTokenMiddleware, requireRole(['admin']), listUsers);
router.delete('/:id', verifyTokenMiddleware, deleteUser);
router.put('/:id', verifyTokenMiddleware, updateUser);
router.post('/profile',verifyTokenMiddleware,getUserDetails);


export default router;
