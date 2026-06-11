const TOKEN_KEY = 'pettycash_token';
const ROLE_KEY = 'pettycash_role';
const SITE_ID_KEY = 'pettycash_site_id';
const PROJECT_ID_KEY = 'pettycash_project_id';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(SITE_ID_KEY);
  localStorage.removeItem(PROJECT_ID_KEY);
}

export function getRole(): string | null {
  return localStorage.getItem(ROLE_KEY);
}

export function setRole(role: string): void {
  localStorage.setItem(ROLE_KEY, role);
}

export function getSiteId(): number | null {
  const val = localStorage.getItem(SITE_ID_KEY);
  return val ? parseInt(val) : null;
}

export function setSiteId(siteId: number | null): void {
  if (siteId !== null) {
    localStorage.setItem(SITE_ID_KEY, String(siteId));
  } else {
    localStorage.removeItem(SITE_ID_KEY);
  }
}

export function getProjectId(): number | null {
  const val = localStorage.getItem(PROJECT_ID_KEY);
  return val ? parseInt(val) : null;
}

export function setProjectId(projectId: number | null): void {
  if (projectId !== null) {
    localStorage.setItem(PROJECT_ID_KEY, String(projectId));
  } else {
    localStorage.removeItem(PROJECT_ID_KEY);
  }
}

export function clearAuth(): void {
  removeToken();
}
