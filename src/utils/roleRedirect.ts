import type { UserRole } from '../types/user.types';

/**
 * Get the dashboard route based on user role
 */
export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case 'student':
      return '/studentDashboard';
    case 'landlord':
      return '/landlordDashboard';
    case 'admin':
      return '/admin';
    default:
      return '/';
  }
};

/**
 * Redirect user to appropriate dashboard based on role
 */
export const redirectToDashboard = (role: UserRole, navigate: (path: string) => void): void => {
  const dashboardRoute = getDashboardRoute(role);
  navigate(dashboardRoute);
};
