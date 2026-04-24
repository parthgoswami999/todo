import { body, param, query } from 'express-validator';

const priorityValues = ['low', 'medium', 'high'];

export const taskIdValidator = [param('id').isMongoId().withMessage('Invalid task id')];

export const createTaskValidator = [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters long'),
  body('status').optional().isInt({ min: 0, max: 2 }).withMessage('Invalid task status'),
  body('priority').optional().isIn(priorityValues).withMessage('Invalid task priority'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid due date')
];

export const updateTaskValidator = [
  ...taskIdValidator,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters long'),
  body('status').optional().isInt({ min: 0, max: 2 }).withMessage('Invalid task status'),
  body('priority').optional().isIn(priorityValues).withMessage('Invalid task priority'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid due date')
];

export const reorderTaskValidator = [
  ...taskIdValidator,
  body('status').isInt({ min: 0, max: 2 }).withMessage('Invalid task status'),
  body('position').isInt({ min: 0 }).withMessage('Position must be a positive integer')
];

export const taskQueryValidator = [
  query('status').optional().isIn(['0', '1', '2', 'all']).withMessage('Invalid status filter'),
  query('search').optional().isString().withMessage('Invalid search query')
];
