'use client'

import React from 'react'
import { Modal } from '@/components/Modal'
import { EventDetails } from '@/components/EventDetails'
import { EventItem } from '@/components/EventItem'
import { TimeAxis } from '@/components/TimeAxis'
import { useTime } from '@/utils/useTime'
import type { Event } from '@/utils/ical'
import { isSameDay, formatTime } from '@/utils/date'
import { calculateStartingPositionFromDate } from '@/utils/events'

type DayViewProps = {
  /**
   * List of hours to display.
   *
   * The use case is that you don't necessarily want to display all hours of the day but instead select only a subset of hours which are actually used by events.
   * This should ideally be computed for all events irregardless of day and then used across every day view such that every day has the same starting and ending hour.
   */
  hoursToDisplay: Date[]
  currentDate: Date
  /**
   * List of all calendar events, filtered to only include events that are on the current day
   */
  filteredEvents: Event[]
  /**
   * The id of the event that is currently active, if any
   * A modal will be shown with event details if this is set
   */
  activeEventId: string | undefined
  /**
   * Callback to set or unset the active event
   * Used for opening and closing the modal
   */
  onActiveEventIdChange: (eventId: string | undefined) => void
}

export const DayView = ({
  hoursToDisplay,
  currentDate,
  filteredEvents,
  activeEventId,
  onActiveEventIdChange
}: DayViewProps) => {
  const startingTime = hoursToDisplay[0]
  const [time, ready] = useTime(10000)

  return (
    <div className="relative flex w-full overflow-y-scroll" style={{ height: 'calc(100vh - 108px)' }}>
      {ready ? (
        <div
          className={`absolute h-1 w-full ${isSameDay(currentDate, time) ? 'bg-red-400' : 'bg-gray-200'}`}
          style={{ top: calculateStartingPositionFromDate(startingTime, time) - 2 }}
        ></div>
      ) : null}
      <TimeAxis hours={hoursToDisplay} />
      <div className="relative grow">
        {filteredEvents.map((event) => (
          <Modal
            key={event.uuid}
            title={event.title}
            trigger={
              <div>
                <EventItem
                  event={event}
                  startingTime={startingTime}
                  onClick={() => onActiveEventIdChange(event.uuid)}
                />
              </div>
            }
            open={event.uuid === activeEventId}
            onOpenChange={(open) => !open && onActiveEventIdChange(undefined)}
          >
            <EventDetails event={event} />
          </Modal>
        ))}
      </div>
      <div className="h-fit w-14">
        {ready ? (
          <div
            className={`absolute ml-2 bg-white px-1 text-sm ${
              isSameDay(currentDate, time) ? 'text-red-400' : 'text-gray-400'
            }`}
            style={{ top: calculateStartingPositionFromDate(startingTime, time) - 10 }}
          >
            {formatTime(time)}
          </div>
        ) : null}
      </div>
    </div>
  )
}
