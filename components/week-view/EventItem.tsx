'use client'

import React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { clsx } from 'clsx'
import { BadgeCheck } from 'lucide-react'
import type { Event } from '@/utils/ical'
import { formatTime } from '@/utils/date'
import { calculateDurationFromDate, calculateHeightFromDate, calculateStartingPositionFromDate } from '@/utils/events'
import type { AccentColorBasedStyle } from '@/utils/constants'
import { ACCENT_COLOR_VARIANTS, MARGIN_EVENTS } from '@/utils/constants'

export const COLORS_PER_PRIORITY: AccentColorBasedStyle = {
  blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200 data-[state="active"]:bg-blue-200',
  pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200 data-[state="active"]:bg-pink-200',
  green: 'bg-green-100 text-green-700 hover:bg-green-200 data-[state="active"]:bg-green-200',
  purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200 data-[state="active"]:bg-purple-200',
  orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200 data-[state="active"]:bg-orange-200',
  sky: 'bg-sky-100 text-sky-700 hover:bg-sky-200 data-[state="active"]:bg-sky-200',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200 data-[state="active"]:bg-fuchsia-200'
}

type EventItemProps = {
  event: Event
  startingTime: Date
  isActive: boolean
  onClick?: () => void
}

export const EventItem = ({ event, startingTime, isActive, onClick }: EventItemProps) => {
  // duration calculation should stop at the end of the day as these events are split into multiple, thus simply subtracting start from end is not enough
  const duration = calculateDurationFromDate(event.start, event.end)

  // - `full`: title and location can be 2 lines long
  // - `medium`: location can be 2 lines long
  // - `short`: merge starting time and location into one line, omit ending time
  // - `shortest`: merge title and starting time, omit ending time and location
  const detailLevel = duration >= 2 ? 'full' : duration >= 1.5 ? 'medium' : duration >= 1 ? 'short' : 'shortest'

  return (
    <div
      className="absolute"
      style={{
        left: 16 * (event.priority - 1) + 3,
        width: `calc(100% - 6px - ${16 * (event.priority - 1)}px)`,
        top: calculateStartingPositionFromDate(startingTime, event.start) + MARGIN_EVENTS,
        height: calculateHeightFromDate(event.start, event.end) - 2 * MARGIN_EVENTS
      }}
    >
      <Popover.Anchor
        asChild /* TODO: it is very very hacky to place this element here, will have to find a better solution for this :c */
      >
        <div
          onClick={onClick}
          data-priority={event.priority}
          data-state={isActive ? 'active' : 'inactive'}
          className={clsx(
            'block h-full w-full cursor-pointer rounded-lg py-1.5',
            COLORS_PER_PRIORITY[ACCENT_COLOR_VARIANTS[event.priority - 1]],
            {
              'outline outline-[3px] outline-white': isActive || event.maxPriority > 1,
              'z-10': isActive,
              'z-0': !isActive,
              'pl-3 pr-2': detailLevel === 'full',
              'pl-3 pr-1': detailLevel === 'medium' || detailLevel === 'short' || detailLevel === 'shortest'
            }
          )}
        >
          <div className="flex items-start">
            {detailLevel !== 'shortest' ? (
              <span
                className={clsx('text-sm font-semibold', {
                  'text-ellipsis hyphens-auto break-words line-clamp-2': detailLevel === 'full',
                  'truncate ': detailLevel === 'medium' || detailLevel === 'short'
                })}
              >
                {event.title}
              </span>
            ) : (
              <span className="truncate text-sm">
                <span className="font-semibold">{event.title}</span>
                <span className="">{` · ${formatTime(event.start)}`}</span>
              </span>
            )}
            {event.verified ? <BadgeCheck className="ml-1 mt-0.5 h-4 w-4 shrink-0 stroke-[2.5px]" /> : null}
          </div>
          {detailLevel === 'full' || detailLevel === 'medium' ? (
            <>
              <div className="text-xs">{`${formatTime(event.start)} - ${formatTime(event.end)}`}</div>
              <div className="line-clamp-2 text-ellipsis hyphens-auto break-words text-xs">{event.shortLocation}</div>
            </>
          ) : detailLevel === 'short' ? (
            <div className="truncate text-xs">{`${formatTime(event.start)} · ${event.shortLocation}`}</div>
          ) : null}
        </div>
      </Popover.Anchor>
    </div>
  )
}
