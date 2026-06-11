export function getDashboardPath(role: string | null): string | null {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'project_manager') return '/pm/dashboard';
  if (role === 'supervisor') return '/supervisor/dashboard';
  return null;
}
