import type { Event } from '@/utils/ical'
import { HEIGHT_PER_HOUR } from '@/utils/constants'
import { type DaysOfTheWeek, compareByDay, isSameDay, computeStartAndEndOfWeek, dateRange } from '@/utils/date'

/**
 * Filters out all events which don't take place on the given `date`
 * Generally events are considered to be on the same day if their starting OR end time is on the same day
 * One special case is events which end at 00:00, those are excluded as well.
 * Thus an event which goes from 18:00 to 00:00 is not considered to be part of the next day (even though 00:00 is technically part of the next day)
 */
export const filterEventsByDate = (events: Event[], date: Date) =>
  events.filter(
    (event) =>
      isSameDay(event.start, date) ||
      (isSameDay(event.end, date) && event.end.getHours() !== 0 && event.end.getMinutes() !== 0)
  )

/**
 * Filters out all events which don't take place in the week of the given `dayInWeek`. The week starts on `startOfWeek`
 * Generally events are considered to be in the same week if their starting OR end time is in the same week
 * One special case is events which end at 00:00, those are excluded as well.
 * Thus an event which goes from 18:00 to 00:00 on a sunday is not considered to be part of the next week (even though 00:00 is technically part of the next week; assuming the week starts on monday)
 *
 * This function doesn't just return a filtered list of events, but also a mapping from days to events for each day in the week (array with the events associated with `startOfWeek` as the first element)
 */
export const filterEventsByWeek = (events: Event[], dayInWeek: Date, startOfWeek: DaysOfTheWeek) => {
  const { start, end } = computeStartAndEndOfWeek(dayInWeek, startOfWeek)

  const days = dateRange(start, end).map((day) => filterEventsByDate(events, day))

  const activeDays = days.map((day) => day.length > 0)

  const filteredEvents = events.filter((event) => {
    const x = compareByDay(event.start, start) >= 0 && compareByDay(event.start, end) <= 0
    const y = isSameDay(event.end, end) && event.end.getHours() === 0 && event.end.getMinutes() === 0
    return x || y
  })

  return {
    filteredEvents,
    activeDays,
    days
  }
}

/**
 * The starting position is calculated by the difference between the starting time and the start of the event
 */
export const calculateStartingPositionFromDate = (startingTime: Date, date: Date) => {
  const hoursFromStart = date.getHours() - startingTime.getHours() + date.getMinutes() / 60 + 0.5

  return hoursFromStart * HEIGHT_PER_HOUR
}

export const calculateDurationFromDate = (start: Date, end: Date) => {
  const duration = (end.getHours() || 24) - start.getHours() + (end.getMinutes() - start.getMinutes()) / 60
  return duration < 0 ? 24 - start.getHours() - start.getMinutes() / 60 : duration
}

/**
 * The height of an event is calculated by its length and the height of an hour
 */
export const calculateHeightFromDate = (start: Date, end: Date) =>
  calculateDurationFromDate(start, end) * HEIGHT_PER_HOUR

/**
 * this takes the earliest hour and rounds it down (meaning 9:30 becomes 9:00)
 * as well as the latest hour and rounds it up (meaning 22:30 becomes 23:00)
 * it will treat 00:00 on the next day as being 24:00 on the current day
 */
export const calculateHoursFromEvents = (events: Event[]): Date[] => {
  const startingHours = events.map((event) => event.start.getHours() + event.start.getMinutes() / 60)
  const endingHours = events.map((event) => event.end.getHours() + event.end.getMinutes() / 60)

  let earliest = Math.floor(Math.min(...startingHours))
  let latest = Math.ceil(Math.max(...endingHours))

  // search for event spanning multiple days and in that case:
  // - if ends at 00:00 assume it ends at 24:00
  // - if ends at some other time take the whole 24 hours regardless
  const spanningEvent = events.find((event) => event.start.getDate() !== event.end.getDate())

  if (spanningEvent && spanningEvent.end.getHours() === 0 && spanningEvent.end.getMinutes() === 0) {
    // take until 24:00
    latest = 24
  } else if (spanningEvent) {
    // take full 24:00
    earliest = 0
    latest = 24
  }

  return Array.from(
    { length: latest - earliest + 1 },
    (_, i) => new Date(`2022-10-01T${(earliest + i).toString().padStart(2, '0')}:00:00`)
  ) // TODO: current date for this thing?
}
