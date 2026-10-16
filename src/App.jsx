import { useEffect, useState } from 'react'
import SiteRow from './components/SiteRow.jsx'
import Donut from './components/Donut.jsx'
import { formatTime, todayKey } from './utils.js'
import './App.css'

const COLORS = ['#6aa9e9', '#4ecb8d', '#f2b84b', '#e0607e', '#a66cd9']
const OTHER_COLOR = '#6b6b74'

function App() {
  const [usage, setUsage] = useState({})
  const [icons, setIcons] = useState({})

  useEffect(() => {
    function load() {
      chrome.storage.local.get(['usage', 'icons']).then((r) => {
        const all = r.usage || {}
        setUsage(all[todayKey()] || {})
        setIcons(r.icons || {})
      })
    }
    load()
    chrome.storage.onChanged.addListener(load)
    return () => chrome.storage.onChanged.removeListener(load)
  }, [])

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
      <header className="top">
        <div>
          <h1>Today</h1>
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
    </div>
  )
}

export default App