import { useState } from 'react'
import { formatTime } from '../utils.js'

// Props: domain, seconds, visits, percent (0 to 100), color
function SiteRow({ domain, seconds, visits, percent, color }) {
  const [iconFailed, setIconFailed] = useState(false)

  // Chrome gives us the site's icon through the "favicon" permission.
  const iconUrl =
    `${chrome.runtime.getURL('/_favicon/')}` +
    `?pageUrl=${encodeURIComponent(`https://${domain}`)}&size=32`

  return (
    <li>
      <div className="row">
        <span className="icon">
          {iconFailed ? (
            domain[0].toUpperCase()
          ) : (
            <img src={iconUrl} alt="" onError={() => setIconFailed(true)} />
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