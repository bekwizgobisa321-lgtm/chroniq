// background.js: the service worker. It watches tabs and does the timing.
// Open its console: chrome://extensions -> your extension -> "service worker".

import { getDomain, todayKey } from './utils.js';

// ---------------------------------------------------------------
// STORAGE SHAPE (keep these consistent everywhere)
//
// chrome.storage.local key "session"  -> what I'm tracking RIGHT NOW
//   { domain: "youtube.com", startedAt: 1760000000000 }   or  null
//
// chrome.storage.local key "usage"    -> totals per day, per domain
//   {
//     "2026-10-12": {
//       "youtube.com": { seconds: 1260, visits: 4 },
//       "github.com":  { seconds: 3400, visits: 9 }
//     }
//   }
//
// Why the session lives in storage, not in a variable:
// Chrome kills the service worker when it is idle. Variables vanish. Storage survives.
// ---------------------------------------------------------------

// ---------- Events (already wired; they only log for now) ----------

chrome.tabs.onActivated.addListener((info) => {
  console.log('[event] tab activated', info);
  handleChange();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  // onUpdated fires a lot. Only react when the URL actually changes.
  if (changeInfo.url) {
    console.log('[event] tab url changed', changeInfo.url);
    handleChange();
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  console.log('[event] window focus changed', windowId);
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Chrome lost focus (I switched to another app)
    stopTracking();
  } else {
    handleChange();
  }
});

chrome.idle.setDetectionInterval(60); // seconds without input before "idle"
chrome.idle.onStateChanged.addListener((state) => {
  console.log('[event] idle state', state); // "active" | "idle" | "locked"
  if (state === 'active') {
    handleChange();
  } else {
    stopTracking();
  }
});

chrome.runtime.onStartup.addListener(() => {
  console.log('[event] browser started');
  // TODO: a session saved before Chrome closed is stale. Discard it (do NOT add its time).
});

// Safety net: save progress every minute so a long session isn't lost if the worker dies.
chrome.alarms.create('save-progress', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'save-progress') {
    console.log('[alarm] save progress');
    // TODO: add the time so far to today's total, then reset startedAt to now
    //       (so the same seconds are never counted twice)
  }
});

// ---------- Logic (yours to write) ----------

/**
 * Called whenever something might have changed what I'm looking at.
 * TODO 1: get the active tab in the focused window (chrome.tabs.query)
 * TODO 2: domain = getDomain(tab.url). If null -> stopTracking() and return.
 * TODO 3: read the current session. If it is already this domain -> do nothing.
 * TODO 4: otherwise stopTracking(), then startTracking(domain).
 */
async function handleChange() {
  // TODO
}

/**
 * Save "I started looking at <domain> at <now>" into storage.
 * Also count a VISIT here: this is a new arrival on the site.
 * Think: should a page reload count as a new visit? (Probably not. Why not?)
 */
async function startTracking(domain) {
  // TODO
}

/**
 * Read the session, work out elapsed seconds, add them to today's usage, clear the session.
 * Do nothing if there is no session.
 * Think: what if the session is absurdly old (laptop slept)? Cap it?
 */
async function stopTracking() {
  // TODO
}

/**
 * Add seconds (and optionally a visit) to usage[today][domain].
 * Remember: storage reads/writes are async. Read the whole "usage" object,
 * change it, write it back.
 */
async function addUsage(domain, seconds, countVisit = false) {
  // TODO
}
