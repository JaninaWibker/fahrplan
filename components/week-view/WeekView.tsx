import { clsx } from 'clsx'
import { useState } from 'react'
import { EventDetails } from '../EventDetails'
import type { Event } from '@/utils/ical'
import { formatTime, type DaysOfTheWeek, isSameDay, computeStartAndEndOfWeek, dateRange } from '@/utils/date'
import { ACCENT_COLOR_VARIANTS, HEIGHT_PER_HOUR } from '@/utils/constants'
import { calculateStartingPositionFromDate } from '@/utils/events'
import { useTime } from '@/utils/useTime'
import { TimeAxis } from '@/components/week-view/TimeAxis'
import { EventItem } from '@/components/week-view/EventItem'
import { Modal } from '@/components/week-view/Modal'

type WeekViewProps = {
  /**
   * The date of a day in the week to display
   */
  week: Date
  /**
   * For each day of the week an array of events that occur on that day
   */
  eventsPerWeekDay: Event[][]
  /**
   * Indicates whether a day has any events or not
   */
  activeDays: boolean[]
  /**
   * Indicatas which day is used as the start of the week
   */
  startOfWeek: DaysOfTheWeek
  /**
   * List of hours to display.
   *
   * The use case is that you don't necessarily want to display all hours of the day but instead select only a subset of hours which are actually used by events.
   * This should ideally be computed for all events irregardless of day and then used across every day view such that every day has the same starting and ending hour.
   */
  hoursToDisplay: Date[]
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

export const WeekView = ({
  week,
  eventsPerWeekDay,
  activeDays,
  startOfWeek,
  hoursToDisplay,
  activeEventId: initialActiveEventId,
  onActiveEventIdChange
}: WeekViewProps) => {
  console.log({
    week,
    eventsPerWeekDay,
    activeDays,
    startOfWeek,
    hoursToDisplay
  })
  const startingTime = hoursToDisplay[0]
  const [time, ready] = useTime(10000)
  const [activeEventId, setActiveEventId] = useState<string | undefined>(initialActiveEventId)

  const { start, end } = computeStartAndEndOfWeek(week, startOfWeek)
  const days = dateRange(start, end)

  const hourDividers = hoursToDisplay.map((_, i) => (
    <div
      key={`hour-${i}`}
      className="border-t border-gray-100"
      style={{ height: i === 0 ? HEIGHT_PER_HOUR / 2 : HEIGHT_PER_HOUR }}
    />
  ))

  const updateActiveEventId = (eventId: string | undefined) => {
    setActiveEventId(eventId)
    onActiveEventIdChange(eventId)
  }

  return (
    <div className="max-h-[calc(100vh-145px)] overflow-y-scroll">
      <div className="relative flex">
        {/* time axis */}
        <div className="h-fit w-[72px] shrink-0">
          <TimeAxis hours={hoursToDisplay} />
        </div>

        {ready ? (
          <div
            className="absolute flex h-1 w-full"
            style={{ top: calculateStartingPositionFromDate(startingTime, time) - 2 }}
          >
            <div className="h-1 w-[72px] shrink-0 bg-pink-200"></div>
            <div className="grid h-1 grow grid-cols-7 divide-x-[2px] px-[2px]">
              {days.map((day, i) => {
                const highlighted = isSameDay(day, time)
                return (
                  <div
                    key={`timeline-day-${i}`}
                    className={clsx('h-1 w-full', highlighted ? 'relative z-10 bg-pink-500' : 'bg-pink-200')}
                  >
                    {highlighted ? (
                      <div className="absolute left-[-8px] top-[-5px] h-[14px] w-[14px] rounded-full bg-pink-500"></div>
                    ) : null}
                  </div>
                )
              })}
            </div>
            <div className="h-1 w-[72px] shrink-0">
              <div className="h-1 w-[8px] rounded-r bg-pink-200"></div>
            </div>
          </div>
        ) : null}

        {/* day columns and events */}
        <div className="grid w-full grid-cols-7 divide-x-[2px] divide-solid divide-gray-200 border-x-[2px] border-gray-200">
          {eventsPerWeekDay.map((events, i) => (
            <div key={`day-${i}`} className="relative">
              {hourDividers}
              {events.map((event) => (
                <Modal
                  key={event.uuid}
                  title={event.title}
                  verified={event.verified}
                  accentColorVariant={ACCENT_COLOR_VARIANTS[event.priority - 1]}
                  open={event.uuid === activeEventId}
                  onOpenChange={(open) => !open && updateActiveEventId(undefined)}
                  trigger={
                    <div>
                      <EventItem
                        key={event.uuid}
                        event={event}
                        startingTime={startingTime}
                        isActive={event.uuid === activeEventId}
                        onClick={() => updateActiveEventId(event.uuid)}
                      />
                    </div>
                  }
                >
                  <EventDetails event={event} accentColorVariant={ACCENT_COLOR_VARIANTS[event.priority - 1]} withDate />
                </Modal>
              ))}
            </div>
          ))}
        </div>

        {/* current time */}
        <div className="h-fit w-[72px] shrink-0">
          {ready ? (
            <div
              className="absolute ml-2 bg-white px-1 text-sm font-semibold text-pink-400"
              style={{ top: calculateStartingPositionFromDate(startingTime, time) - 10 }}
            >
              {formatTime(time)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
