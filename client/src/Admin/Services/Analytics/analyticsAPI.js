// Centralized client for Analytics API
const BASE = '/api/analytics';

async function getJSON(path, params) {
  const url = new URL(path, window.location.origin);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.pathname + url.search, { credentials: 'include' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function exportCSV(path, filename) {
  const res = await fetch(path, { credentials: 'include' });
  if (!res.ok) throw new Error(`Export failed: ${res.status}`);
  const blob = await res.blob();
  downloadBlob(blob, filename);
}

export const analyticsAPI = {
  overview: (params) => getJSON(`${BASE}/overview`, params),
  users: (params) => getJSON(`${BASE}/users`, params),
  seminars: (params) => getJSON(`${BASE}/seminars`, params),
  eic: (params) => getJSON(`${BASE}/eic`, params),
  distribution: (params) => getJSON(`${BASE}/distribution`, params),
  inventory: (params) => getJSON(`${BASE}/inventory`, params),

  export: {
    overview: () => exportCSV(`${BASE}/overview/export.csv`, 'overview.csv'),
    users: () => exportCSV(`${BASE}/users/export.csv`, 'users_analytics.csv'),
    seminars: () => exportCSV(`${BASE}/seminars/export.csv`, 'seminars_analytics.csv'),
    eic: () => exportCSV(`${BASE}/eic/export.csv`, 'eic_analytics.csv'),
    distribution: () => exportCSV(`${BASE}/distribution/export.csv`, 'distribution_analytics.csv'),
    inventory: () => exportCSV(`${BASE}/inventory/export.csv`, 'inventory_analytics.csv'),
  }
};
