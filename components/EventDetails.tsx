'use client'

import { CalendarClock, MapPin } from 'lucide-react'
import { clsx } from 'clsx'
import { formatDate, formatTime } from '@/utils/date'
import type { Event } from '@/utils/ical'
import type { AccentColorBasedStyle, AccentColorVariant } from '@/utils/constants'

const COLORS_PER_ACCENT_COLOR_VARIANT: AccentColorBasedStyle = {
  blue: 'text-blue-700 visited:text-blue-500',
  pink: 'text-pink-700 visited:text-pink-500',
  green: 'text-green-700 visited:text-green-500',
  purple: 'text-purple-700 visited:text-purple-500',
  orange: 'text-orange-700 visited:text-orange-500',
  sky: 'text-sky-700 visited:text-sky-500',
  fuchsia: 'text-fuchsia-700 visited:text-fuchsia-500'
}

type EventDetails = {
  event: Event
  withDate?: boolean
  accentColorVariant?: AccentColorVariant
}

export const EventDetails = ({ event, withDate = false, accentColorVariant = 'pink' }: EventDetails) => {
  return (
    <div>
      {event.location ? (
        <div className="flex flex-row gap-4 py-2">
          <MapPin className="h-7 w-6 shrink-0 pt-1 text-gray-400" aria-label="Ort" />
          <a
            className={clsx('underline underline-offset-2', COLORS_PER_ACCENT_COLOR_VARIANT[accentColorVariant])}
            href={`http://maps.google.com/?q=${encodeURIComponent(event.location)}`}
          >
            {event.location}
          </a>
        </div>
      ) : null}
      <div className="flex flex-row items-center gap-4 py-2">
        <CalendarClock className="h-7 w-6 shrink-0 text-gray-400" aria-label="Uhrzeit" />
        <span>
          {formatTime(event.start)} - {formatTime(event.end)} {withDate ? `(${formatDate(event.start)})` : null}
        </span>
      </div>
      {event.description ? (
        <div className="custom-prose pl-10 pr-4 pt-2" dangerouslySetInnerHTML={{ __html: event.description }} />
      ) : null}
    </div>
  )
}
