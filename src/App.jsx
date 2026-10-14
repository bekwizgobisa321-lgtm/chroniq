import { useEffect, useState } from 'react'
import SiteRow from './components/SiteRow.jsx'
import { formatTime, todayKey } from './utils.js'
import './App.css'

function App() {
  // Today's usage, shaped like:
  // { "youtube.com": { seconds: 1260, visits: 4 }, "github.com": { seconds: 3400, visits: 9 } }
  const [usage, setUsage] = useState({})

  useEffect(() => {
    // TODO 1: read the "usage" key from chrome.storage.local (it is async)
    // TODO 2: usage is saved per day, so pick today's object: all[todayKey()]
    //         If nothing is saved yet, use {}
    // TODO 3: call setUsage(...) with today's object
  }, [])

  // TODO 4: turn the usage object into an array of { domain, seconds, visits }
  //         (hint: Object.entries) and sort it, biggest seconds first
  // TODO 5: totalSeconds = sum of all seconds
  // TODO 6: biggestSeconds = the largest seconds (used for the bar width)

  return (
    <div className="app">
      <header>
        <h1>Today</h1>
        <p className="total">
          Total: <strong>{/* TODO: formatTime(totalSeconds) */}0s</strong>
        </p>
      </header>

      <ul className="site-list">
        {/* TODO: map your sorted array to <SiteRow key=... domain=... seconds=... visits=... percent=... /> */}
      </ul>

      {/* TODO: show this message only when there is no data */}
      <p className="empty">No data yet. Browse a bit, then reopen this popup.</p>
    </div>
  )
}

export default App
