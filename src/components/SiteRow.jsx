import { useState } from 'react'
import { formatTime } from '../utils.js'

// Props: domain, seconds, visits, percent (0 to 100), color, icon (a link, or undefined)
function SiteRow({ domain, seconds, visits, percent, color, icon }) {
  const [iconFailed, setIconFailed] = useState(false)

  // No saved icon yet: show a letter. Not Chrome's gray globe.
  const showImage = icon && !iconFailed

  return (
    <li>
      <div className="row">
        <span className="icon">
          {showImage ? (
            <img src={icon} alt="" onError={() => setIconFailed(true)} />
          ) : (
            domain[0].toUpperCase()
          )}
        </span>
        <span className="domain">{domain}</span>
        <span className="meta">
          {formatTime(seconds)} | {visits} {visits === 1 ? 'visit' : 'visits'}
        </span>
      </div>
      <div className="bar">
        <span style={{ width: `${percent}%`, background: color }} />
      </div>
    </li>
  )
}

export default SiteRow