'use client'

import { CalendarClock, MapPin } from 'lucide-react'
import { formatTime } from '../utils/date'
import type { Event } from '../utils/ical'

type EventDetails = {
  event: Event
}

export const EventDetails = ({ event }: EventDetails) => {
  return (
    <div>
      {event.location ? (
        <div className="flex flex-row gap-4 py-2">
          <MapPin className="h-7 w-6 shrink-0 pt-1 text-gray-400" aria-label="Ort" />
          <a
            className="text-pink-700 underline underline-offset-2 visited:text-pink-500"
            href={`http://maps.google.com/?q=${encodeURIComponent(event.location)}`}
          >
            {event.location}
          </a>
        </div>
      ) : null}
      <div className="flex flex-row items-center gap-4 py-2">
        <CalendarClock className="h-7 w-6 shrink-0 text-gray-400" aria-label="Uhrzeit" />
        <span>
          {formatTime(event.start)} - {formatTime(event.end)}
        </span>
      </div>
      {event.description ? (
        <div className="pl-10 pr-4 pt-2" dangerouslySetInnerHTML={{ __html: event.description }} />
      ) : null}
    </div>
  )
}
