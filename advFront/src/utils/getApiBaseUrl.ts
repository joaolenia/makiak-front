export function getApiBaseUrl(): string {
  const localUrl = localStorage.getItem('apiUrl');
  return localUrl || import.meta.env.VITE_API_URL || '';
}
