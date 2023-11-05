import { Header } from './Header'
import { DayView } from './DayView'
import { isEarlierDay } from '@/utils/date'
import { filterEventsByDate } from '@/utils/events'
import type { Event } from '@/utils/ical'

type DayOrWeekViewProps = {
  events: Event[]
  currentDate: Date
  setCurrentDate: (date: Date) => void
  activeEventId: string | undefined
  onActiveEventIdChange: (eventId: string | undefined) => void
  hoursToDisplay: Date[]
  startingDay: Date
  endingDay: Date
}

export const DayViewThingie = ({
  events,
  activeEventId,
  onActiveEventIdChange,
  currentDate,
  setCurrentDate,
  hoursToDisplay,
  startingDay,
  endingDay
}: DayOrWeekViewProps) => {
  const canPrev = isEarlierDay(startingDay, currentDate) // startingDate < date
  const canNext = isEarlierDay(currentDate, endingDay) // date < endingDate

  const prev = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const next = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  const filteredEvents = filterEventsByDate(events, currentDate)

  return (
    <>
      <Header date={currentDate} onPrev={prev} onNext={next} canPrev={canPrev} canNext={canNext} />
      <DayView
        filteredEvents={filteredEvents}
        hoursToDisplay={hoursToDisplay}
        currentDate={currentDate}
        activeEventId={activeEventId}
        onActiveEventIdChange={onActiveEventIdChange}
      />
    </>
  )
}
