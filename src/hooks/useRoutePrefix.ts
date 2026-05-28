import { useAuth } from '../contexts/AuthContext';

export const useRoutePrefix = () => {
  const { user } = useAuth();

  if (!user) return '';

  if (user.roles.includes('SUPER_ADMIN')) {
    return '/admin';
  }
  if (user.roles.includes('COACH')) {
    return '/coach';
  }
  if (user.roles.includes('CLIENT')) {
    return '/client';
  }
  if (user.roles.includes('STUDENT')) {
    return '/student';
  }

  return '';
};
