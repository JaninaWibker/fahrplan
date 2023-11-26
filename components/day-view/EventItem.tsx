'use client'

import React from 'react'
import { clsx } from 'clsx'
import { BadgeCheck } from 'lucide-react'
import type { Event } from '@/utils/ical'
import { formatTime } from '@/utils/date'
import { calculateDurationFromDate, calculateHeightFromDate, calculateStartingPositionFromDate } from '@/utils/events'
import { MARGIN_EVENTS } from '@/utils/constants'

export const COLORS_PER_PRIORITY: Record<number, string> = {
  1: 'bg-blue-100 text-blue-700 hover:bg-blue-200 data-[state="active"]:bg-blue-200',
  2: 'bg-pink-100 text-pink-700 hover:bg-pink-200 data-[state="active"]:bg-pink-200',
  3: 'bg-green-100 text-green-700 hover:bg-green-200 data-[state="active"]:bg-green-200',
  4: 'bg-purple-100 text-purple-700 hover:bg-purple-200 data-[state="active"]:bg-purple-200',
  5: 'bg-orange-100 text-orange-700 hover:bg-orange-200 data-[state="active"]:bg-orange-200',
  6: 'bg-sky-100 text-sky-700 hover:bg-sky-200 data-[state="active"]:bg-sky-200',
  7: 'bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200 data-[state="active"]:bg-fuchsia-200'
}

type EventItemProps = {
  event: Event
  startingTime: Date
  isActive: boolean
  onClick?: () => void
}

export const EventItem = ({ event, startingTime, isActive, onClick }: EventItemProps) => {
  return (
    <div
      onClick={onClick}
      data-priority={event.priority}
      data-state={isActive ? 'active' : 'inactive'}
      className={clsx(
        'absolute rounded-lg px-3 py-2 outline outline-[3px] outline-white',
        COLORS_PER_PRIORITY[event.priority]
      )}
      style={{
        left: 16 * (event.priority - 1),
        width: `calc(100% - ${8 * (event.priority - 1)}px)`,
        top: calculateStartingPositionFromDate(startingTime, event.start) + MARGIN_EVENTS,
        height: calculateHeightFromDate(event.start, event.end) - 2 * MARGIN_EVENTS
      }}
    >
      <div className="flex items-center truncate text-sm font-semibold">
        {event.title}
        {event.verified ? <BadgeCheck className="h-4 w-5 stroke-[2.5px] pl-1" /> : null}
      </div>
      <div className="text-sm">{`${formatTime(event.start)} - ${formatTime(event.end)}`}</div>
      {calculateDurationFromDate(event.start, event.end) > 1 ? (
        <div className="truncate text-xs">{event.shortLocation}</div>
      ) : null}
    </div>
  )
}
