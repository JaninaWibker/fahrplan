import React from 'react'
import type { Event } from '../utils/ical'
import { isSameDay, formatTime } from '../utils/date'

const HEIGHT_PER_HOUR = 48
const MARGIN_EVENTS = 2

/**
 * The starting position is calculated by the difference between the starting time and the start of the event
 */
const calculateStartingPositionFromDate = (startingTime: Date, date: Date) => {
  const hoursFromStart = (date.getHours() - startingTime.getHours()) + (date.getMinutes() / 60) + 0.5

  return hoursFromStart * HEIGHT_PER_HOUR
}

/**
 * The height of an event is calculated by its length and the height of an hour
 */
const calculateHeightFromDate = (start: Date, end: Date) => {
  const hours = (end.getHours() - start.getHours()) + (end.getMinutes() - start.getMinutes()) / 60

  return hours * HEIGHT_PER_HOUR
}

/**
 * this takes the earliest hour and rounds it down (meaning 9:30 becomes 9:00)
 * as well as the latest hour and rounds it up (meaning 22:30 becomes 23:00)
 * it will treat 00:00 on the next day as being 24:00 on the current day
 */
const calculateHoursFromEvents = (events: Event[]): Date[] => {
  const startingHours = events.map(event => event.start.getHours() + (event.start.getMinutes() / 60))
  const endingHours = events.map(event => event.end.getHours() + (event.end.getMinutes() / 60))

  let earliest = Math.floor(Math.min(...startingHours))
  let latest = Math.ceil(Math.max(...endingHours))

  // search for event spanning multiple days and in that case:
  // - if ends at 00:00 assume it ends at 24:00
  // - if ends at some other time take the whole 24 hours regardless
  const spanningEvent = events.find(event => event.start.getDate() !== event.end.getDate())

  if (spanningEvent && spanningEvent.end.getHours() === 0 && spanningEvent.end.getMinutes() === 0) {
    // take until 24:00
    latest = 24
  } else if (spanningEvent) {
    // take full 24:00
    earliest = 0
    latest = 24
  }

  return Array.from({ length: latest - earliest + 1 }, (_, i) => new Date(`2022-10-01T${(earliest + i).toString().padStart(2, '0')}:00:00`)) // TODO: current date for this thing?
}

type CalendarProps = {
  /**
   * the current date
   */
  date: Date,
  /**
   * list of all calendar events
   * (later filtered by date)
   */
  events: Event[]
}

// TODO: display the current time
const Calendar = ({ events, date }: CalendarProps) => {
  const hours = calculateHoursFromEvents(events)
  const startingTime = hours[0]
  const currentEvents = events.filter(event => isSameDay(event.start, date) || (isSameDay(event.end, date) && event.end.getHours() !== 0 && event.end.getMinutes() !== 0))

  return (
    <div className="w-full flex overflow-y-scroll" style={{ height: 'calc(100vh - 140px' }}>
      <div className="w-16 h-fit">
        {hours.map((hour) => (
          <div key={hour.toISOString()} className="flex items-center justify-end text-right font-medium" style={{ height: HEIGHT_PER_HOUR }}>
            <div className="px-2">{formatTime(hour)}</div>
          </div>
        ))}
      </div>
      <div className="grow relative">
        {currentEvents.map((event) => (
          <div className="absolute rounded-lg bg-blue-300 w-full px-2 py-1" key={event.uuid} style={{
            top: calculateStartingPositionFromDate(startingTime, event.start) + MARGIN_EVENTS,
            height: calculateHeightFromDate(event.start, event.end) - 2 * MARGIN_EVENTS
          }}>
            <div className="text-white">{event.title}</div>
            <div className="text-white text-sm">{`${formatTime(event.start)} - ${formatTime(event.end)}`}</div>
            <div className="text-white text-sm">{event.short_location}</div>

          </div>
        ))}
      </div>
      <div className="w-16 h-fit"></div>
    </div>
  )
}

export default Calendar
