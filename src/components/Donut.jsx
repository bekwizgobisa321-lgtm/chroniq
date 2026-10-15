// A donut chart made of SVG circles. No library.
// slices: [{ value: 3600, color: '#6aa9e9' }, ...]
function Donut({ slices }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0)
  if (total === 0) return null

  // r = 15.915 makes the circle length exactly 100, so values are percentages.
  let used = 0
  return (
    <svg className="donut" viewBox="0 0 42 42">
      <circle cx="21" cy="21" r="15.915" fill="none" stroke="#3a3a3e" strokeWidth="6" />
      {slices.map((s, i) => {
        const pct = (s.value / total) * 100
        const circle = (
          <circle
            key={i}
            cx="21"
            cy="21"
            r="15.915"
            fill="none"
            stroke={s.color}
            strokeWidth="6"
            strokeDasharray={`${pct} ${100 - pct}`}
            strokeDashoffset={25 - used}
          />
        )
        used += pct
        return circle
      })}
    </svg>
  )
}

export default Donut