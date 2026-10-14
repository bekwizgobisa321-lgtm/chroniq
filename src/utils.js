// utils.js: small helpers shared by background.js and App.jsx

export function getDomain(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return null;
    }
    let host = u.hostname;
    if (host.startsWith("www.")) {
      host = host.slice(4);
    }
    return host;
  } catch {
    return null;
  }
}

export function todayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
