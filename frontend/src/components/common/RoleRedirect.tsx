import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { getDashboardPath } from '../../utils/roleRoutes';

export default function RoleRedirect() {
  const { isAuthenticated, role } = useSelector((s: RootState) => s.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const dashboardPath = getDashboardPath(role);
  return <Navigate to={dashboardPath ?? '/login'} replace />;
}
