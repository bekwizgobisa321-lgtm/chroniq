# Chroniq

<img width="1806" height="916" alt="image" src="https://github.com/user-attachments/assets/6f5ee8f6-7922-4b60-8d12-bc71643b64a1" />

A Chrome extension that automatically tracks how long you spend on each website, per day, and how many times you come back to it.

**Your data stays on your computer.** Everything is saved in `chrome.storage.local`. Nothing is sent anywhere.

## Features

- Automatic tracking of every `http` and `https` site in the active tab (no list to set up)
- Ignores `chrome://` pages, the new tab page, and `about:blank`
- Stops counting when Chrome loses focus, or when you are idle or the screen is locked
- Popup with **Today**, **7 days** and **30 days** views
- Total time, a donut chart of your top sites, and a list with time, visits and a bar for each site
- A bar chart of the last 7 days
- Site logos next to each name
- **Full-page dashboard** with 7, 30, 90 days and All time, stat tiles, a daily trend, a share chart and a table of all sites
- **Export** your data as a JSON file

## How it works

Chroniq has 3 parts that talk through one shared place:

| Part | File | What it does |
|---|---|---|
| Background worker | `src/background.js` | Watches tabs, counts time, saves it. Plain JavaScript (it has no page) |
| Storage | `chrome.storage.local` | The saved data. It survives restarts and worker sleep |
| Popup and dashboard | `src/App.jsx`, `src/dashboard/` | React. They only read the saved data and draw it |

The worker writes. The popup and dashboard read. They never talk directly.

### The tracking loop

1. A tab, window, idle or alarm event fires.
2. `handleChange()` finds the active tab and its domain with `getDomain()`.
3. Same site as before: do nothing (a reload is not a new visit).
4. Different site: `stopTracking()` adds the elapsed seconds to the old site, then `startTracking()` saves the new site and the start time.
5. Every minute, `saveProgress()` saves the time so far and restarts the clock. At most 1 minute is lost if the worker dies.

**Why the session is saved in storage and not in a variable:** Chrome stops the service worker when it is idle, and variables are erased. We save a start time and subtract later (`now - startedAt`) instead of using a timer.

**Safety rules**
- A queue runs events one at a time, so time is never counted twice.
- A session older than 5 minutes (laptop slept, worker killed) is thrown away.
- A session saved before Chrome closed is cleared on startup.

### Saved data

```js
// "session": what you are looking at right now, or null
{ domain: "youtube.com", startedAt: 1760000000000 }

// "usage": totals per day, per site
{ "2026-10-20": { "youtube.com": { seconds: 1260, visits: 4 } } }

// "icons": each site's logo link
{ "youtube.com": "https://www.youtube.com/favicon.ico" }
```

Day keys use your local time, not UTC.

## Permissions

| Permission | Why |
|---|---|
| `tabs` | Read the address of the active tab |
| `storage` | Save your usage data locally |
| `idle` | Stop counting when you are away |
| `alarms` | Save progress every minute |

## Project structure

```
Chroniq/
  index.html              popup entry page
  dashboard.html          full-page dashboard entry page
  vite.config.js          builds 3 entries: popup, dashboard, background
  package.json
  .oxlintrc.json          linter config (knows about `chrome`)
  public/
    manifest.json         copied to dist/ as-is
    icons/                icon16.png, icon48.png, icon128.png
  src/
    main.jsx              mounts the popup
    index.css             base styles and color tokens
    App.css               popup styles
    App.jsx               popup logic: load data, range tabs, combine days
    background.js         events and timing logic
    utils.js              getDomain, dateKey, todayKey, lastDays, formatTime
    components/
      SiteRow.jsx         one row: logo, name, time, visits, bar
      Donut.jsx           donut chart made of SVG circles
      WeekChart.jsx       bars for the last 7 days
    dashboard/
      main.jsx            mounts the dashboard
      Dashboard.jsx       dashboard logic and layout
      dashboard.css       dashboard styles
```

## Install and run (for development)

1. Install Node.js (LTS) from nodejs.org
2. Open this folder in VS Code and run in the terminal:

```
npm install
npm run build
```

3. Open `chrome://extensions` and turn on **Developer mode**
4. Click **Load unpacked** and choose the **`dist`** folder (not the project folder)
5. Pin the extension from the puzzle icon in the toolbar
6. Click **Open full dashboard** in the popup to see the full page

### Daily loop

1. Edit code in `src/`
2. Run `npm run build` (or keep `npm run watch` running)
3. On `chrome://extensions`, click the **reload** icon on the extension card
4. Reopen the popup

`npm run dev` is not used for extensions. Always load `dist/` and rebuild after every change.

## Install for others (without a store)

1. Download `Chroniq.zip` from the latest [release](../../releases)
2. Unzip it, open `chrome://extensions` and turn on **Developer mode**
3. Click **Load unpacked** and choose the unzipped folder

Chrome shows a warning for extensions loaded this way. That is normal.

## When something breaks

| What | Where to look |
|---|---|
| Background logs and errors | `chrome://extensions` → Chroniq → **service worker** |
| Popup logs and errors | Right-click the icon → **Inspect popup** |
| Load errors | The red **Errors** button on the extension card |
| Build errors | The terminal where you ran `npm run build` |
| See saved data | Service worker console: `chrome.storage.local.get(null, console.log)` |
| Wipe saved data | Service worker console: `chrome.storage.local.clear()` |

Chrome rejects extension files whose names start with `_`. Don't create any.

## Known limits

- It tracks websites in this browser on this computer only. It does not track other apps or your phone.
- "Visits" means the number of times you came back to a site. Switching away and back counts again. A rule to ignore returns within 30 seconds is planned.
- The idle limit is 60 seconds, so up to a minute of idle time can be counted before tracking stops.

## Roadmap

- [x] Tracking: time and visits per site, per day
- [x] Popup with the donut chart and site logos
- [x] Today, 7 days and 30 days views, and the weekly chart
- [x] Full-page dashboard
- [x] Export of your data
- [ ] Fix the visits counter (ignore quick returns)
- [ ] Test checklist: two tabs of the same site, idle, a new day, restart
- [ ] Final icons
- [ ] Categories (distracting, productive, neutral) and daily limits
- [ ] Import and restore of your data
- [ ] Publish on Edge Add-ons and the Chrome Web Store
