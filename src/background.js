// background.js: the service worker. It watches tabs and does the timing.
// Open its console: chrome://extensions -> Chroniq -> "service worker".

import { getDomain, todayKey } from "./utils.js";

// STORAGE SHAPE
// "session" -> { domain: "youtube.com", startedAt: 1760000000000 } or null
// "usage"   -> { "2026-10-14": { "youtube.com": { seconds: 1260, visits: 4 } } }

// A session older than this is fake (laptop slept, worker was killed). We drop it.
const MAX_SESSION_SECONDS = 5 * 60;

// Run one job at a time, so two events can never count the same seconds twice.
let queue = Promise.resolve();
function enqueue(job) {
  queue = queue.then(job).catch((err) => console.error("[chroniq]", err));
  return queue;
}

// ---------- Events ----------
//"The user has switched to a different tab."
chrome.tabs.onActivated.addListener(() => enqueue(handleChange));

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  // onUpdated fires a lot. Only react when the URL actually changes.
  if (changeInfo.url) enqueue(handleChange);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    enqueue(stopTracking); // Chrome lost focus
  } else {
    enqueue(handleChange);
  }
});

chrome.idle.setDetectionInterval(60);
chrome.idle.onStateChanged.addListener((state) => {
  if (state === "active") {
    enqueue(handleChange);
  } else {
    enqueue(stopTracking); // "idle" or "locked"
  }
});

chrome.runtime.onStartup.addListener(() => {
  // A session saved before Chrome closed is stale. Discard it (do NOT add its time).
  enqueue(async () => {
    await chrome.storage.local.set({ session: null });
    await handleChange();
  });
});

// Safety net: every minute, save the time so far and restart the clock.
chrome.alarms.create("save-progress", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "save-progress") enqueue(saveProgress);
});

// ---------- Logic ----------

async function getSession() {
  const { session } = await chrome.storage.local.get("session");
  return session ?? null;
}

//True only if a chrome window exists and has focus
// True only if a Chrome window exists and has focus.
async function isChromeFocused() {
  try {
    const win = await chrome.windows.getLastFocused();
    return win.focused;
  } catch {
    return false; // no window at all
  }
}

// What am I looking at right now? Start, keep, or stop tracking.
async function handleChange() {
  if (!(await isChromeFocused())) {
    await stopTracking();
    return;
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const domain = tab ? getDomain(tab.url) : null;
  if (!domain) {
    await stopTracking();
    return;
  }

  const session = await getSession();
  if (session && session.domain === domain) return; // same site: nothing to do

  await stopTracking();
  await startTracking(domain);
}

// Save "I started looking at <domain> at <now>" and count one visit.
async function startTracking(domain) {
  await chrome.storage.local.set({
    session: { domain, startedAt: Date.now() },
  });
  await addUsage(domain, 0, true);
}

// Add the elapsed time to today's total, then clear the session.
async function stopTracking() {
  const session = await getSession();
  if (!session) return;

  const elapsed = Math.round((Date.now() - session.startedAt) / 1000);
  await chrome.storage.local.set({ session: null });
  if (elapsed > 0 && elapsed <= MAX_SESSION_SECONDS) {
    await addUsage(session.domain, elapsed);
  }
}

// Add the time so far, and move startedAt to now (no second is counted twice).
async function saveProgress() {
  const session = await getSession();
  if (!session) return;

  const now = Date.now();
  const elapsed = Math.round((now - session.startedAt) / 1000);
  await chrome.storage.local.set({ session: { ...session, startedAt: now } });
  if (elapsed > 0 && elapsed <= MAX_SESSION_SECONDS) {
    await addUsage(session.domain, elapsed);
  }
}

// usage[today][domain].seconds += seconds, and visits += 1 if countVisit.
async function addUsage(domain, seconds, countVisit = false) {
  const { usage = {} } = await chrome.storage.local.get("usage");
  const day = todayKey();
  usage[day] ??= {};
  usage[day][domain] ??= { seconds: 0, visits: 0 };
  usage[day][domain].seconds += seconds;
  if (countVisit) usage[day][domain].visits += 1;
  await chrome.storage.local.set({ usage });
}
