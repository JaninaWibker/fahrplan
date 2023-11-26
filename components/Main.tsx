'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Event } from '@/utils/ical'
import { calculateHoursFromEvents } from '@/utils/events'
import { DayViewThingie } from '@/components/day-view'
import { WeekViewThingie } from '@/components/week-view'

const USE_WEEK_VIEW = true // TODO: somehow make this dependant on screen size (width)

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
