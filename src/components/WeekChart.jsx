import { formatTime, dateKey } from '../utils.js'

// Bars for the last 7 days. `all` is the whole usage object: { "2026-10-18": { site: {seconds} } }
function WeekChart({ all }) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const sites = all[dateKey(d)] || {}
    const seconds = Object.values(sites).reduce((sum, s) => sum + s.seconds, 0)
    days.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), seconds })
  }
  const max = Math.max(...days.map((d) => d.seconds), 1)

  return (
    <div className="week">
      {days.map((day, i) => (
        <div className="week-col" key={i} title={`${day.label}: ${formatTime(day.seconds)}`}>
          <span className="week-time">{day.seconds > 0 ? formatTime(day.seconds).replace(/ \d+s$/, '') : ''}</span>
          <div className="week-bar">
            <span style={{ height: `${(day.seconds / max) * 100}%` }} />
          </div>
          <span className="week-label">{day.label}</span>
        </div>
      ))}
    </div>
  )
}

export default WeekChart