import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import React from 'react';

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
    if (userRole && !allowedRoles.includes(userRole)) {
      // Redirect to their correct dashboard
      if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
      if (userRole === 'project_manager') return <Navigate to="/pm/dashboard" replace />;
      if (userRole === 'supervisor') return <Navigate to="/supervisor/dashboard" replace />;
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
