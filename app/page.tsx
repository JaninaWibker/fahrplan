import { compareByDay, clampDay } from '../utils/date'
import { load, deserialize } from '../utils/ical'
import type { Event } from '../utils/ical'
import { Main } from '../components/Main'
import '../styles/globals.css'

const computeDateRangeClamp = () => {
  const clampCurrentYear = process.env.DATE_RANGE_CLAMP_CURRENT_YEAR === 'true'
  const startClamp = new Date(process.env.DATE_RANGE_CLAMP_START || '')
  const endClamp = new Date(process.env.DATE_RANGE_CLAMP_END || '')

  if (clampCurrentYear) {
    return {
      min: new Date(new Date().getFullYear(), 0, 0),
      max: new Date(new Date().getFullYear(), 11, 31)
    }
  }

  if (Number.isNaN(startClamp.getTime())) {
    return { min: undefined, max: undefined }
  }
  if (Number.isNaN(endClamp.getTime())) {
    return { min: undefined, max: undefined }
  } else {
    return { min: startClamp, max: endClamp }
  }
}

const computeDateRangeState = (events: Event[], currentDay: Date) => {
  const { min, max } = computeDateRangeClamp()
  const filteredEvents =
    min !== undefined && max !== undefined
      ? events.filter((event) => compareByDay(event.start, min) >= 0 && compareByDay(event.end, max) <= 0)
      : events

  const sortedDates = filteredEvents.flatMap((event) => [event.start, event.end]).sort(compareByDay)
  const startingDay = sortedDates[0]
  const endingDay = sortedDates[sortedDates.length - 1]
  const initialDay = clampDay(startingDay, endingDay, currentDay)

  return {
    startingDay,
    endingDay,
    initialDay
  }
}

const Home = async () => {
  if (process.env.ICAL_URL === undefined) throw new Error('ICAL_URL is not defined')
  const serializedEvents = await load(process.env.ICAL_URL)
  const events = deserialize(serializedEvents)

  const { startingDay, endingDay, initialDay } = computeDateRangeState(events, new Date())

  return <Main startingDay={startingDay} endingDay={endingDay} initialDay={initialDay} events={events} />
}

export default Home
