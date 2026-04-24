import { Router } from 'express';
import {
  createTaskHandler,
  deleteTaskHandler,
  getTask,
  getTasks,
  reorderTaskHandler,
  updateTaskHandler
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/errorMiddleware.js';
import {
  createTaskValidator,
  reorderTaskValidator,
  taskIdValidator,
  taskQueryValidator,
  updateTaskValidator
} from '../validators/taskValidators.js';

const router = Router();

router.use(protect);
router.get('/', taskQueryValidator, validateRequest, getTasks);
router.get('/:id', taskIdValidator, validateRequest, getTask);
router.post('/', createTaskValidator, validateRequest, createTaskHandler);
router.patch('/:id', updateTaskValidator, validateRequest, updateTaskHandler);
router.patch('/:id/reorder', reorderTaskValidator, validateRequest, reorderTaskHandler);
router.delete('/:id', taskIdValidator, validateRequest, deleteTaskHandler);

export default router;
