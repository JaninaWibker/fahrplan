import { Main } from '@/components/Main'
import { NoIcalUrl } from '@/components/error-states/NoIcalUrl'
import { Empty } from '@/components/error-states/Empty'
import { compareByDay, clampDay } from '@/utils/date'
import { computeDateRangeClamp, getConfig } from '@/utils/config'
import { load, deserialize } from '@/utils/ical'
import type { Event } from '@/utils/ical'

import '@/styles/globals.css'

const computeDateRangeState = (events: Event[], currentDay: Date) => {
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

const Home = async () => {
  const { icalUrl } = getConfig()

  if (icalUrl === undefined) {
    return <NoIcalUrl />
  }

  const serializedEvents = await load(icalUrl)
  const events = deserialize(serializedEvents)

  const { startingDay, endingDay, initialDay, filteredEvents, empty } = computeDateRangeState(events, new Date())

  if (empty) {
    return <Empty />
  }

  return <Main startingDay={startingDay} endingDay={endingDay} initialDay={initialDay} events={filteredEvents} />
}

export default Home
