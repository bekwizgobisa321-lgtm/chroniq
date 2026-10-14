# Time Tracker (Chrome extension, React + Vite)

Automatically tracks how long you spend on each website per day, and how many times you open it.
Data stays on your computer (`chrome.storage.local`). Nothing is sent anywhere.

## Two parts, two kinds of code

| Part | File | Kind |
|---|---|---|
| Popup (what you see when you click the icon) | `index.html`, `src/App.jsx`, `src/components/` | React |
| Background worker (does the timing) | `src/background.js` | Plain JavaScript |
| Shared helpers | `src/utils.js` | Plain JavaScript |

The background worker has no page, so React can't run there.

## Folder structure

```
time-tracker/
  index.html              popup entry page
  vite.config.js          builds TWO entries: popup + background
  package.json
  .oxlintrc.json          linter config (knows about `chrome`)
  public/
    manifest.json         copied to dist/ as-is
    icons/                16, 48, 128 px PNG icons
  src/
    main.jsx              mounts React (done)
    index.css             popup base styles (done)
    App.css               list styles (done)
    App.jsx               popup logic (TODO)
    components/
      SiteRow.jsx         one row of the list (done)
    utils.js              getDomain, todayKey, formatTime (TODO)
    background.js         events + timing logic (TODO)
```

## Setup (one time)

1. Install Node.js (LTS) from nodejs.org if `node -v` doesn't work in your terminal
2. Open this folder in VS Code
3. In the terminal run: `npm install`
4. Run: `npm run build`
5. Open `chrome://extensions`, turn on **Developer mode**
6. Click **Load unpacked** and choose the **`dist`** folder (not the project folder)
7. Pin the extension from the puzzle icon in the toolbar

## Daily loop

1. Edit code in `src/`
2. Run `npm run build` (or leave `npm run watch` running, it rebuilds on every save)
3. Go to `chrome://extensions` and click the **reload** icon on the extension card
4. Reopen the popup

`npm run dev` is not used for extensions.

## Where to look when something breaks

| What | Where |
|---|---|
| Background logs and errors | `chrome://extensions` -> your extension -> **service worker** |
| Popup logs and errors | Right-click the icon -> **Inspect popup** |
| Load errors | Red **Errors** button on the extension card |
| Build errors | The terminal where you ran `npm run build` |
| See saved data | In the service worker console: `chrome.storage.local.get(null, console.log)` |
| Wipe saved data | In the service worker console: `chrome.storage.local.clear()` |

## Notes
- `npm run lint` shows warnings about unused variables. That is normal until the TODOs are filled in.
- Always load `dist/`, and rebuild after every change. Forgetting to rebuild is the most common mistake.
- Chrome rejects extension files whose names start with `_`. Don't create any.

## Stages

1. Setup and first load (this folder is ready for it)
2. `utils.js`: `getDomain`, `todayKey`, `formatTime`
3. `background.js`: `handleChange`, `startTracking`, `stopTracking`, `addUsage`
4. `App.jsx`: read storage, sort, total, render rows
5. Edge cases and the test checklist
6. Polish, final build, optional Chrome Web Store
