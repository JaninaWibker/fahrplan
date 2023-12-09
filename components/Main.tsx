'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { Event } from '@/utils/ical'
import { calculateHoursFromEvents } from '@/utils/events'
import { DayViewThingie } from '@/components/day-view'
import { WeekViewThingie } from '@/components/week-view'
import { useMediaQuery } from '@/utils/useMediaQuery'

type MainProps = {
  startingDay: Date
  endingDay: Date
  initialDay: Date
  events: Event[]
  /**
   * tri-state logic:
   * - undefined: use mobile view if on mobile, else use desktop view
   * - true: use desktop view
   * - false: use mobile view
   */
  isWeekView?: boolean
}

export const Main = ({ startingDay, endingDay, initialDay, events, isWeekView }: MainProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeEventId = searchParams.get('event') || undefined
  const activeEvent = events.find((event) => event.uuid === activeEventId)

  const { ready, state: isMobile } = useMediaQuery('screen and (min-width: 1px) and (max-width: 832px)')

  const onActiveEventIdChange = (eventId: string | undefined) => {
    if (eventId === undefined) {
      router.push(pathname)
    } else {
      router.push(`?event=${eventId}`)
    }
  }

  const [currentDate, setCurrentDate] = useState(activeEvent ? activeEvent.start : initialDay)

  const hoursToDisplay = calculateHoursFromEvents(events)

  const shouldUseDayView = isWeekView !== undefined ? !isWeekView : isMobile

  const DayOrWeekView = shouldUseDayView ? DayViewThingie : WeekViewThingie

  console.log('ready', ready)

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
