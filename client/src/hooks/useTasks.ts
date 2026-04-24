import { useEffect } from 'react';
import { fetchTasks, setFilters } from '../store/slices/taskSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { TaskFilters } from '../types';

export const useTasks = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks);

  useEffect(() => {
    void dispatch(fetchTasks(tasks.filters));
  }, [dispatch, tasks.filters]);

  return {
    ...tasks,
    updateFilters: (filters: TaskFilters) => dispatch(setFilters(filters)),
    refreshTasks: () => dispatch(fetchTasks(tasks.filters))
  };
};
