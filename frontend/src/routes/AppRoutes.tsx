import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import ProjectManagerLayout from '../layouts/ProjectManagerLayout';
import SupervisorLayout from '../layouts/SupervisorLayout';

// Auth
import LoginPage from '../pages/auth/LoginPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/DashboardPage';
import AdminProjectsPage from '../pages/admin/ProjectsPage';
import AdminUsersPage from '../pages/admin/UsersPage';
import AdminSitesPage from '../pages/admin/SitesPage';
import SiteDetailsPage from '../pages/admin/SiteDetailsPage';
import AdminCashIssuancePage from '../pages/admin/CashIssuancePage';
import AdminExpensesPage from '../pages/admin/ExpensesPage';
import AdminReportsPage from '../pages/admin/ReportsPage';

// Project Manager Pages
import PMDashboardPage from '../pages/pm/DashboardPage';
import PMSitesPage from '../pages/pm/SitesPage';
import PMExpensesPage from '../pages/pm/ExpensesPage';
import PMReportsPage from '../pages/pm/ReportsPage';
import PMCashIssuancePage from '../pages/pm/CashIssuancePage';

// Supervisor Pages (formerly manager)
import SupervisorDashboardPage from '../pages/manager/DashboardPage';
import MySitePage from '../pages/manager/MySitePage';
import SupervisorCashIssuancePage from '../pages/manager/CashIssuancePage';
import SupervisorExpensesPage from '../pages/manager/ExpensesPage';
import AddExpensePage from '../pages/manager/AddExpensePage';
import EditExpensePage from '../pages/manager/EditExpensePage';
import ChangePasswordPage from '../pages/manager/ChangePasswordPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="sites" element={<AdminSitesPage />} />
        <Route path="sites/:id" element={<SiteDetailsPage />} />
        <Route path="cash-issuances" element={<AdminCashIssuancePage />} />
        <Route path="expenses" element={<AdminExpensesPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>

      {/* Project Manager */}
      <Route
        path="/pm"
        element={
          <ProtectedRoute role="project_manager">
            <ProjectManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PMDashboardPage />} />
        <Route path="sites" element={<PMSitesPage />} />
        <Route path="cash-issuances" element={<PMCashIssuancePage />} />
        <Route path="expenses" element={<PMExpensesPage />} />
        <Route path="reports" element={<PMReportsPage />} />
      </Route>

      {/* Supervisor */}
      <Route
        path="/supervisor"
        element={
          <ProtectedRoute role="supervisor">
            <SupervisorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SupervisorDashboardPage />} />
        <Route path="my-site" element={<MySitePage />} />
        <Route path="cash-issuances" element={<SupervisorCashIssuancePage />} />
        <Route path="expenses" element={<SupervisorExpensesPage />} />
        <Route path="expenses/add" element={<AddExpensePage />} />
        <Route path="expenses/:id/edit" element={<EditExpensePage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
