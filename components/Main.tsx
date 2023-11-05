'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { WeekView } from '@/components/WeekView'
import { DayView } from '@/components/DayView'
import { Header } from '@/components/Header'
import type { Event } from '@/utils/ical'
import { isEarlierDay, isEarlierWeek, isSameDay } from '@/utils/date'
import { calculateHoursFromEvents, filterEventsByWeek } from '@/utils/events'
import { getConfig } from '@/utils/config'

const USE_WEEK_VIEW = true

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

const DayViewThingie = ({
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

  const filteredEvents = events.filter(
    (event) =>
      isSameDay(event.start, currentDate) ||
      (isSameDay(event.end, currentDate) && event.end.getHours() !== 0 && event.end.getMinutes() !== 0)
  )

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

const WeekViewThingie = ({
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

type MainProps = {
  startingDay: Date
  endingDay: Date
  initialDay: Date
  events: Event[]
}

export const Main = ({ startingDay, endingDay, initialDay, events }: MainProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeEventId = searchParams.get('event') || undefined
  const activeEvent = events.find((event) => event.uuid === activeEventId)

  const onActiveEventIdChange = (eventId: string | undefined) => {
    if (eventId === undefined) {
      router.push('/')
    } else {
      router.push(`?event=${eventId}`)
    }
  }

  const [currentDate, setCurrentDate] = useState(activeEvent ? activeEvent.start : initialDay)

  const hoursToDisplay = calculateHoursFromEvents(events)

  const DayOrWeekView = USE_WEEK_VIEW ? WeekViewThingie : DayViewThingie

  return (
    <DayOrWeekView
      events={events}
      activeEventId={activeEventId}
      onActiveEventIdChange={onActiveEventIdChange}
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      hoursToDisplay={hoursToDisplay}
      startingDay={startingDay}
      endingDay={endingDay}
    />
  )
}
