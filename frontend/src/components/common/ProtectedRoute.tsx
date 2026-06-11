import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import React from 'react';
import { getDashboardPath } from '../../utils/roleRoutes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string | string[];
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, role: userRole } = useSelector((s: RootState) => s.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!userRole) {
      return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
      const dashboardPath = getDashboardPath(userRole);
      return <Navigate to={dashboardPath ?? '/login'} replace />;
    }
  }

  return <>{children}</>;
}
