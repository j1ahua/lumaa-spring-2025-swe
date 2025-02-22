import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/tasks.controller';

const router = Router();

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

export default router;