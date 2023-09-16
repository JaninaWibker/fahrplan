import { compareByDay, clampDay } from '../utils/date'
import { load, deserialize } from '../utils/ical'
import type { Event } from '../utils/ical'
import { Main } from '../components/Main'
import '../styles/globals.css'

const calculateSomeStateThings = (events: Event[], currentDay: Date) => {
  const sortedDates = events.flatMap((event) => [event.start, event.end]).sort(compareByDay)
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

  const { startingDay, endingDay, initialDay } = calculateSomeStateThings(events, new Date())

  return <Main startingDay={startingDay} endingDay={endingDay} initialDay={initialDay} events={events} />
}

export default Home
