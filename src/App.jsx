import { useEffect, useState } from 'react'
import SiteRow from './components/SiteRow.jsx'
import Donut from './components/Donut.jsx'
import WeekChart from './components/WeekChart.jsx'
import { formatTime, lastDays } from './utils.js'
import './App.css'

const COLORS = ['#6aa9e9', '#4ecb8d', '#f2b84b', '#e0607e', '#a66cd9']
const OTHER_COLOR = '#6b6b74'
const RANGES = [
  { days: 1, tab: 'Today', title: 'Today' },
  { days: 7, tab: '7 days', title: 'Last 7 days' },
  { days: 30, tab: '30 days', title: 'Last 30 days' },
]

// Add the days together: { domain: { seconds, visits } }
function combine(all, days) {
  const result = {}
  for (const key of lastDays(days)) {
    const day = all[key]
    if (!day) continue // no data for that day: skip it
    for (const [domain, data] of Object.entries(day)) {
      result[domain] ??= { seconds: 0, visits: 0 }
      result[domain].seconds += data.seconds
      result[domain].visits += data.visits
    }
  }
  return result
}

function App() {
  const [all, setAll] = useState({}) // every saved day
  const [icons, setIcons] = useState({})
  const [days, setDays] = useState(1)

  useEffect(() => {
    function load() {
      chrome.storage.local.get(['usage', 'icons']).then((r) => {
        setAll(r.usage || {})
        setIcons(r.icons || {})
      })
    }
    load()
    chrome.storage.onChanged.addListener(load)
    return () => chrome.storage.onChanged.removeListener(load)
  }, [])

  const range = RANGES.find((r) => r.days === days)
  const usage = combine(all, days)

  const sites = Object.entries(usage)
    .map(([domain, data]) => ({ domain, seconds: data.seconds, visits: data.visits }))
    .sort((a, b) => b.seconds - a.seconds)

  const totalSeconds = sites.reduce((sum, site) => sum + site.seconds, 0)
  const biggestSeconds = sites.length > 0 ? sites[0].seconds : 0

  const top = sites.slice(0, COLORS.length)
  const otherSeconds = sites.slice(COLORS.length).reduce((sum, s) => sum + s.seconds, 0)
  const slices = top.map((s, i) => ({ value: s.seconds, color: COLORS[i] }))
  if (otherSeconds > 0) slices.push({ value: otherSeconds, color: OTHER_COLOR })

  return (
    <div className="app">
      <div className="tabs">
        {RANGES.map((r) => (
          <button
            key={r.days}
            className={r.days === days ? 'tab active' : 'tab'}
            onClick={() => setDays(r.days)}
          >
            {r.tab}
          </button>
        ))}
      </div>

      <header className="top">
        <div>
          <h1>{range.title}</h1>
          <p className="total">
            Total: <strong>{formatTime(totalSeconds)}</strong>
          </p>
          <div className="big">{formatTime(totalSeconds)}</div>
        </div>
        <Donut slices={slices} />
      </header>

      <section className="section">
        <h2>Top sites</h2>
        <ul className="site-list">
          {sites.map((site, i) => (
            <SiteRow
              key={site.domain}
              domain={site.domain}
              seconds={site.seconds}
              visits={site.visits}
              percent={biggestSeconds > 0 ? (site.seconds / biggestSeconds) * 100 : 0}
              color={i < COLORS.length ? COLORS[i] : OTHER_COLOR}
              icon={icons[site.domain]}
            />
          ))}
        </ul>
        {sites.length === 0 && (
          <p className="empty">No data yet. Browse a bit, then reopen this popup.</p>
        )}
      </section>

      <section className="section week-section">
        <h2>Last 7 days</h2>
        <WeekChart all={all} />
      </section>
    </div>
  )
}

export default App