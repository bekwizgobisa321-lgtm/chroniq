// utils.js: small helpers shared by background.js and popup.js
// Each function is empty on purpose. Write them yourself and test in the console.

/**
 * Turn a full URL into a clean domain.
 *   "https://www.youtube.com/watch?v=abc"  ->  "youtube.com"
 *   "https://m.youtube.com/"               ->  decide: "youtube.com" or "m.youtube.com"?
 *   "chrome://extensions"                  ->  null  (not a real website, never track it)
 *   "about:blank", "", undefined           ->  null
 * Hints: the URL object, url.protocol, url.hostname, try/catch for bad input.
 */
export function getDomain(url) {
  // TODO
  return null;
}

/**
 * Today's date as a storage key, like "2026-10-12".
 * Careful: toISOString() uses UTC, so it can give the wrong day late at night.
 * Decide if that matters to you.
 */
export function todayKey() {
  // TODO
  return '';
}

/**
 * Seconds -> readable text.
 *   45    -> "45s"
 *   750   -> "12m 30s"
 *   4980  -> "1h 23m"
 */
export function formatTime(seconds) {
  // TODO
  return '';
}
