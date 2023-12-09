import { Main } from '@/components/Main'
import { NoIcalUrl } from '@/components/error-states/NoIcalUrl'
import { Empty } from '@/components/error-states/Empty'
import { getConfig } from '@/utils/config'
import { load, deserialize } from '@/utils/ical'
import { computeDateRangeState } from '@/utils/state'

import '@/styles/globals.css'

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

  return (
    <Main
      startingDay={startingDay}
      endingDay={endingDay}
      initialDay={initialDay}
      events={filteredEvents}
      isWeekView={true}
    />
  )
}

export default Home
