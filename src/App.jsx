import { useEffect, useState } from "react";
import SiteRow from "./components/SiteRow.jsx";
import { formatTime, todayKey } from "./utils.js";
import "./App.css";

function App() {
  // Today's usage: { "youtube.com": { seconds: 1260, visits: 4 }, ... }
  const [usage, setUsage] = useState({});

  useEffect(() => {
    function load() {
      chrome.storage.local.get("usage").then((r) => {
        const all = r.usage || {};
        setUsage(all[todayKey()] || {});
      });
    }

    load(); // when the popup opens

    // refresh while the popup is open, when the background saves new time
    chrome.storage.onChanged.addListener(load);
    return () => chrome.storage.onChanged.removeListener(load);
  }, []);

  // { domain, seconds, visits } list, biggest time first
  const sites = Object.entries(usage)
    .map(([domain, data]) => ({
      domain,
      seconds: data.seconds,
      visits: data.visits,
    }))
    .sort((a, b) => b.seconds - a.seconds);

  const totalSeconds = sites.reduce((sum, site) => sum + site.seconds, 0);
  const biggestSeconds = sites.length > 0 ? sites[0].seconds : 0;

  return (
    <div className="app">
      <header>
        <h1>Today</h1>
        <p className="total">
          Total: <strong>{formatTime(totalSeconds)}</strong>
        </p>
      </header>

      <ul className="site-list">
        {sites.map((site) => (
          <SiteRow
            key={site.domain}
            domain={site.domain}
            seconds={site.seconds}
            visits={site.visits}
            percent={
              biggestSeconds > 0 ? (site.seconds / biggestSeconds) * 100 : 0
            }
          />
        ))}
      </ul>

      {sites.length === 0 && (
        <p className="empty">
          No data yet. Browse a bit, then reopen this popup.
        </p>
      )}
    </div>
  );
}

export default App;
