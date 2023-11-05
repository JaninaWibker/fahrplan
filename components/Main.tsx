'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Event } from '@/utils/ical'
import { DayView } from '@/components/DayView'
import { Header } from '@/components/Header'
import { isEarlierDay, isSameDay } from '@/utils/date'
import { calculateHoursFromEvents } from '@/utils/events'

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

  const [currentDate, setCurrentDate] = useState(activeEvent ? activeEvent.start : initialDay)

  const hoursToDisplay = calculateHoursFromEvents(events)

  const onActiveEventIdChange = (eventId: string | undefined) => {
    if (eventId === undefined) {
      router.push('/')
    } else {
      router.push(`?event=${eventId}`)
    }
  }

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
