// order is the same as `.getDay()` uses
export const DAYS_OF_THE_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
export type DaysOfTheWeek = (typeof DAYS_OF_THE_WEEK)[number]

const isSameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()

/**
 * calculates a < b with accuracy to the day, thus:
 * - a is earlier than b => true
 * - a is the same as b => false
 * - a is later than b => false
 */
const isEarlierDay = (a: Date, b: Date) =>
  a.getFullYear() < b.getFullYear() ||
  (a.getFullYear() === b.getFullYear() && a.getMonth() < b.getMonth()) ||
  (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() < b.getDate())

const isLaterDay = (a: Date, b: Date) => isEarlierDay(b, a)

/**
 * calculates signum(a - b) with accuracy to the day, thus:
 * - a, b are on the same day => 0
 * - a is earlier than b => -1
 * - a is later than b => 1
 */
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

/**
 * Compute a range of days between `start` and `end` (inclusive)
 */
export const dateRange = (start: Date, end: Date) => {
  const days = []
  const currentDay = new Date(start)
  while (!isSameDay(currentDay, end)) {
    days.push(new Date(currentDay))
    currentDay.setDate(currentDay.getDate() + 1)
  }
  days.push(new Date(end))
  return days
}

export const computeStartAndEndOfWeek = (dayInWeek: Date, startOfWeek: DaysOfTheWeek) => {
  const sunday = new Date(dayInWeek)
  sunday.setDate(dayInWeek.getDate() - dayInWeek.getDay())
  const startOfTheWeek = new Date(sunday)
  startOfTheWeek.setDate(sunday.getDate() + DAYS_OF_THE_WEEK.indexOf(startOfWeek))
  const endOfTheWeek = new Date(startOfTheWeek)
  endOfTheWeek.setDate(startOfTheWeek.getDate() + 6)

  return {
    start: startOfTheWeek,
    end: endOfTheWeek
  }
}

export const isSameWeek = (a: Date, b: Date, startOfWeek: DaysOfTheWeek) => {
  const { start: startA, end: endA } = computeStartAndEndOfWeek(a, startOfWeek)
  const { start: startB, end: endB } = computeStartAndEndOfWeek(b, startOfWeek)

  return isSameDay(startA, startB) && isSameDay(endA, endB)
}

export const isEarlierWeek = (a: Date, b: Date, startOfWeek: DaysOfTheWeek) => {
  const { start: startA } = computeStartAndEndOfWeek(a, startOfWeek)
  const { start: startB } = computeStartAndEndOfWeek(b, startOfWeek)

  return isEarlierDay(startA, startB)
}

export const isLaterWeek = (a: Date, b: Date, startOfWeek: DaysOfTheWeek) => {
  const { start: startA } = computeStartAndEndOfWeek(a, startOfWeek)
  const { start: startB } = computeStartAndEndOfWeek(b, startOfWeek)

  return isLaterDay(startA, startB)
}

const formatTime = (date: Date) => date.toLocaleTimeString('de-DE', { hour: 'numeric', minute: 'numeric' })

const formatDate = (date: Date) => date.toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric' })

export { isSameDay, isEarlierDay, isLaterDay, compareByDay, clampDay, formatTime, formatDate }

/** ISO-8601 compliant week number
/*  the first week of a year is the first week that contains a Thursday
/*  @see https://weeknumber.com/how-to/javascript
 */
export const getWeekNumber = (date: Date) => {
  const startOfYear = new Date(date)
  startOfYear.setHours(0, 0, 0, 0)
  // Thursday in current week decides the year.
  startOfYear.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))

  // January 4 is always in week 1
  const firstWeekOfYear = new Date(date.getFullYear(), 0, 4)
  // Adjust to Thursday in week 1 and count number of weeks from date to firstWeekOfYear.
  return (
    1 +
    Math.round(((date.getTime() - firstWeekOfYear.getTime()) / 86400000 - 3 + ((firstWeekOfYear.getDay() + 6) % 7)) / 7)
  )
}
