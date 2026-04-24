import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createTask,
  deleteTaskById,
  getTaskById,
  listTasks,
  reorderTask,
  updateTaskById
} from '../services/taskService.js';

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await listTasks(req.user, req.query);

  res.json({
    success: true,
    data: tasks
  });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.user, req.params.id);

  res.json({
    success: true,
    data: task
  });
});

export const createTaskHandler = asyncHandler(async (req, res) => {
  const task = await createTask(req.user, req.body);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task
  });
});

export const updateTaskHandler = asyncHandler(async (req, res) => {
  const task = await updateTaskById(req.user, req.params.id, req.body);

  res.json({
    success: true,
    message: 'Task updated successfully',
    data: task
  });
});

export const deleteTaskHandler = asyncHandler(async (req, res) => {
  const result = await deleteTaskById(req.user, req.params.id);

  res.json({
    success: true,
    message: 'Task deleted successfully',
    data: result
  });
});

export const reorderTaskHandler = asyncHandler(async (req, res) => {
  const task = await reorderTask(req.user, req.params.id, req.body);

  res.json({
    success: true,
    message: 'Task moved successfully',
    data: task
  });
});
