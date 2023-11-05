import { Header } from './Header'
import { WeekView } from './WeekView'
import { isEarlierWeek } from '@/utils/date'
import { filterEventsByWeek } from '@/utils/events'
import { getConfig } from '@/utils/config'
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

export const WeekViewThingie = ({
  events,
  activeEventId,
  onActiveEventIdChange,
  currentDate,
  setCurrentDate,
  hoursToDisplay,
  startingDay,
  endingDay
}: DayOrWeekViewProps) => {
  const { startOfWeek } = getConfig()
  const canPrev = isEarlierWeek(startingDay, currentDate, startOfWeek) // startingDate < date (week-wise)
  const canNext = isEarlierWeek(currentDate, endingDay, startOfWeek) // date < endingDate (week-wise)

  const prev = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const next = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const { activeDays, days } = filterEventsByWeek(events, currentDate, startOfWeek)

  return (
    <>
      <Header date={currentDate} onPrev={prev} onNext={next} canPrev={canPrev} canNext={canNext} />
      <WeekView
        currentDate={currentDate}
        eventsPerWeekDay={days}
        activeDays={activeDays}
        startOfWeek={startOfWeek}
        hoursToDisplay={hoursToDisplay}
        activeEventId={activeEventId}
        onActiveEventIdChange={onActiveEventIdChange}
      />
    </>
  )
}
