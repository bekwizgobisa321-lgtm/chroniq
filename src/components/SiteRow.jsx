import { formatTime } from '../utils.js'

// One row in the list. The markup is done for you.
// Props:
//   domain  : "youtube.com"
//   seconds : 1260
//   visits  : 4
//   percent : 63   (this site's seconds / the biggest site's seconds * 100)
function SiteRow({ domain, seconds, visits, percent }) {
  return (
    <li>
      <div className="row">
        <span className="domain">{domain}</span>
        <span className="meta">
          {formatTime(seconds)} | {visits} {visits === 1 ? 'visit' : 'visits'}
        </span>
      </div>
      <div className="bar">
        <span style={{ width: `${percent}%` }} />
      </div>
    </li>
  )
}

export default SiteRow
