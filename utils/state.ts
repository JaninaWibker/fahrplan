import { compareByDay, clampDay } from '@/utils/date'
import { computeDateRangeClamp } from '@/utils/config'
import type { Event } from '@/utils/ical'

export const computeDateRangeState = (events: Event[], currentDay: Date) => {
  const { min, max } = computeDateRangeClamp(currentDay)
  const clampFilteredEvents =
    min !== undefined && max !== undefined
      ? events.filter((event) => compareByDay(event.start, min) >= 0 && compareByDay(event.end, max) <= 0)
      : events

  if (clampFilteredEvents.length === 0) {
    return {
      empty: true,
      startingDay: new Date(NaN),
      endingDay: new Date(NaN),
      initialDay: new Date(NaN),
      filteredEvents: []
    }
  }

  const sortedDates = clampFilteredEvents.flatMap((event) => [event.start, event.end]).sort(compareByDay)
  const startingDay = sortedDates[0]
  const endingDay = sortedDates[sortedDates.length - 1]
  const initialDay = clampDay(startingDay, endingDay, currentDay)

  // to make things easier to debug later on filter out all events which aren't in the date range
  // that is going to be shown
  const filteredEvents = events.filter(
    (event) => compareByDay(event.start, startingDay) >= 0 && compareByDay(event.end, endingDay) <= 0
  )

  return {
    startingDay,
    endingDay,
    initialDay,
    filteredEvents,
    empty: filteredEvents.length === 0
  }
}
