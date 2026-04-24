import { useEffect } from 'react';
import { clearAuthError, fetchCurrentUser, logout } from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (auth.token && !auth.user) {
      void dispatch(fetchCurrentUser());
    }
  }, [dispatch, auth.token, auth.user]);

  return {
    ...auth,
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearAuthError())
  };
};
