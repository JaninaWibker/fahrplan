import { Main } from '@/components/Main'
import { compareByDay, clampDay } from '@/utils/date'
import { load, deserialize } from '@/utils/ical'
import type { Event } from '@/utils/ical'
import { getConfig } from '@/utils/config'

import '@/styles/globals.css'

const computeDateRangeClamp = () => {
  const { clampCurrentYear, clampStart, clampEnd } = getConfig()

  if (clampCurrentYear) {
    return {
      min: new Date(new Date().getFullYear(), 0, 0),
      max: new Date(new Date().getFullYear(), 11, 31)
    }
  }

  if (clampStart === undefined || clampEnd === undefined) {
    return { min: undefined, max: undefined }
  } else {
    return { min: clampStart, max: clampEnd }
  }
}

const computeDateRangeState = (events: Event[], currentDay: Date) => {
  const { min, max } = computeDateRangeClamp()
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

const Empty = () => {
  const { min, max } = computeDateRangeClamp()
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Your calendar is empty 🤷🏻</h1>
      <p className="pt-1 text-gray-500">There are no events to show.</p>
      {min !== undefined && max !== undefined && (
        <>
          <p className="pt-8 text-gray-700">
            The calendar is configured to be clamped between <strong>{min.toLocaleDateString()}</strong> and{' '}
            <strong>{max.toLocaleDateString()}</strong>.
            <br />
            Try widening the date range, maybe the issue is just timezones.
          </p>
          <pre className="pt-4 text-sm">
            <code>{JSON.stringify({ min, max }, null, 2)}</code>
          </pre>
        </>
      )}
      <p className="pt-4 text-gray-700">Note that all day events are not supported and will not be shown.</p>
    </div>
  )
}

const NoIcalUrl = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">No ICAL_URL is set 🤷🏻</h1>
      <p className="pt-1 text-gray-500">Please set the ICAL_URL environment variable.</p>
    </div>
  )
}

const Home = async () => {
  const { icalUrl } = getConfig()
  if (icalUrl === undefined) return <NoIcalUrl />
  const serializedEvents = await load(icalUrl)
  const events = deserialize(serializedEvents)

  const { startingDay, endingDay, initialDay, filteredEvents, empty } = computeDateRangeState(events, new Date())

  return empty ? (
    <Empty />
  ) : (
    <Main startingDay={startingDay} endingDay={endingDay} initialDay={initialDay} events={filteredEvents} />
  )
}

export default Home
