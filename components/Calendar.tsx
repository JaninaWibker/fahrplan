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
 */
const calculateHoursFromEvents = (events: Event[]): Date[] => {
  // TODO: this assumes that start and end "are nominal" ie the end comes after the start and is on the same day
  // TODO: if this is not the case it should just use the whole 24 hours; as a special case an event ending at 0:00 should be handled as 24:00 instead of 0
  const earliest = Math.floor(Math.min(...events.map(event => event.start.getHours() + (event.start.getMinutes() / 60))))
  const latest = Math.ceil(Math.max(...events.map(event => event.end.getHours() + (event.end.getMinutes() / 60))))

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
  const currentEvents = events.filter(event => isSameDay(event.start, date) || isSameDay(event.end, date))

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
            <div className="text-white">{`${formatTime(event.start)} - ${formatTime(event.end)}`}</div>
            <div className="text-white">{event.location}</div>

          </div>
        ))}
      </div>
      <div className="w-16 h-fit"></div>
    </div>
  )
}

export default Calendar
