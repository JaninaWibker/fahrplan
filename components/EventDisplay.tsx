'use client'

import { formatTime } from '../utils/date'
import type { Event } from '../utils/ical'

type EventDisplayProps = {
  event: Event
}

export const EventDisplay = ({ event }: EventDisplayProps) => {
  return (
    <div>
      {event.location ? (
        <div className="flex flex-row gap-4 py-2">
          <span className="text-gray-400">{'Ort: '}</span>
          <span>{event.location}</span>
        </div>
      ) : null}
      <div className="flex flex-row gap-4 py-2">
        <span className=" text-gray-400">{'Zeit: '}</span>
        <span>
          {formatTime(event.start)} - {formatTime(event.end)}
        </span>
      </div>
      {event.description ? <div className="" dangerouslySetInnerHTML={{ __html: event.description }} /> : null}
    </div>
  )
}
