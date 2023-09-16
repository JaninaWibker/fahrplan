const isSameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()

const isEarlierDay = (a: Date, b: Date) =>
  a.getFullYear() < b.getFullYear() ||
  (a.getFullYear() === b.getFullYear() && a.getMonth() < b.getMonth()) ||
  (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() < b.getDate())

const isLaterDay = (a: Date, b: Date) => isEarlierDay(b, a)

const compareByDay = (a: Date, b: Date) => {
  const sameDay = isSameDay(a, b)
  const earlierDay = isEarlierDay(a, b)
  return sameDay ? 0 : earlierDay ? -1 : 1
}

const clampDay = (min: Date, max: Date, day: Date) => {
  const lowerBound = compareByDay(min, day) > 0 ? min : day
  const upperBound = compareByDay(lowerBound, max) < 0 ? lowerBound : max
  return upperBound
}

const formatTime = (date: Date) => date.toLocaleTimeString('de-DE', { hour: 'numeric', minute: 'numeric' })

const formatDate = (date: Date) => date.toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric' })

export { isSameDay, isEarlierDay, isLaterDay, compareByDay, clampDay, formatTime, formatDate }
