// utils.js: small helpers shared by background.js and App.jsx

export function getDomain(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return null;
    }
    let host = u.hostname;
    if (host.startsWith('www.')) {
      host = host.slice(4);
    }
    return host;
  } catch {
    return null;
  }
}

// Any date -> "YYYY-MM-DD" in the local time zone (not UTC).
export function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayKey() {
  return dateKey(new Date());
}

// The last n days as date keys, today first: ["2026-10-18", "2026-10-17", ...]
export function lastDays(n) {
  const keys = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.push(dateKey(d));
  }
  return keys;
}

export function formatTime(seconds) {
  const total = Math.floor(seconds);
  if (total < 60) {
    return `${total}s`;
  }
  if (total < 3600) {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}m ${s}s`;
  }
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${h}h ${m}m`;
}