import { parse, transform } from 'parse-ical'
import { clampDate, dateRange, isSameDay, nextDay } from './date'

export type Event = {
  uuid: string
  title: string
  location: string | null
  shortLocation: string | null
  description: string | null
  /**
   * start of event, for multipart events this is the start of the current segment
   */
  start: Date
  /**
   * end of event, for multipart events this is the end of the current segment
   */
  end: Date
  /**
   * same as start if not a multipart event.
   * for multipart events this represents the start of the series
   */
  displayStart: Date
  /**
   * same as end if not a multipart event.
   * for multipart events this represents the end of the series
   */
  displayEnd: Date
  color: string | null // TODO: currently unused
  allDay: boolean
  verified: boolean
  priority: number
  maxPriority: number
  multipart: { index: number; series: [Date, Date][] } | null
}

export type SerializedEvent = {
  uuid: string
  title: string
  location: string | null
  shortLocation: string | null
  description: string | null
  start: string
  end: string
  displayStart: string
  displayEnd: string
  color: string | null // TODO: currently unused
  allDay: boolean
  verified: boolean
  priority: number
  maxPriority: number
  multipart: { index: number; series: [string, string][] } | null
}

const eventId = (event: Omit<Event, 'priority' | 'maxPriority'>) =>
  event.multipart !== null ? `${event.uuid}-${event.multipart.index}` : event.uuid

const intervalGraphColoring = (events: Omit<Event, 'priority' | 'maxPriority'>[]): Event[] => {
  const sortedEntries = events
    .flatMap((event) => [
      { type: 'start', time: event.start.getTime(), uuid: eventId(event) },
      { type: 'end', time: event.end.getTime(), uuid: eventId(event) }
    ])
    .sort((a, b) => {
      if (a.time === b.time) {
        return a.type === 'end' ? -1 : 1
      } else {
        return a.time - b.time
      }
    })

  // proper shape, makes modifications easier
  const entries = sortedEntries.map((entry) => ({ ...entry, priority: 0, maxPriority: 0 }))

  let stack: typeof entries = []

  for (const entry of entries) {
    if (entry.type === 'start') {
      const unusedPriorities = Array.from({ length: stack.length })
        .map((_, i) => i)
        .filter((i) => !stack.some((entry) => entry.priority === i))

      if (unusedPriorities.length > 0) {
        entry.priority = unusedPriorities[0]
      } else {
        entry.priority = stack.length
      }
      stack.push(entry)
    } else {
      const maxPriority = stack.length - 1
      stack.forEach((entry) => {
        entry.maxPriority = Math.max(entry.maxPriority, maxPriority)
      })
      stack = stack.filter(({ uuid }) => uuid !== entry.uuid)
    }
  }

  return entries
    .filter((entry) => entry.type === 'start')
    .map((entry) => {
      const event: Omit<Event, 'priority' | 'maxPriority'> = events.find(
        (event) => eventId(event) === entry.uuid
      ) as Omit<Event, 'priority' | 'maxPriority'>
      return { ...event, priority: entry.priority + 1, maxPriority: entry.maxPriority + 1 }
    })
}

const serialize = (events: Event[]): SerializedEvent[] =>
  events.map((event) => ({
    ...event,
    start: event.start.toISOString(),
    end: event.end.toISOString(),
    displayStart: event.displayStart.toISOString(),
    displayEnd: event.displayEnd.toISOString(),
    multipart: event.multipart
      ? {
          index: event.multipart.index,
          series: event.multipart.series.map(([start, end]) => [start.toISOString(), end.toISOString()])
        }
      : null
  }))

const deserialize = (events: SerializedEvent[]): Event[] =>
  events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
    displayStart: new Date(event.displayStart),
    displayEnd: new Date(event.displayEnd),
    multipart: event.multipart
      ? {
          index: event.multipart.index,
          series: event.multipart.series.map(([start, end]) => [new Date(start), new Date(end)])
        }
      : null
  }))

const shortenLocation = (location: string) => {
  return location.split(',')[0]
}

const load = (url: string): Promise<SerializedEvent[]> =>
  fetch(url, { next: { revalidate: 600 } })
    .then((res) => res.text())
    .then((text) => {
      const { events: icalEvents } = transform(parse(text))

      const events: (Omit<Event, 'priority' | 'maxPriority'> & { priority: null; maxPriority: null })[] =
        icalEvents.map((event) => {
          const allDay = event.start.isAllDay || event.end.isAllDay
          const verified = event.title.startsWith('*')

          return {
            uuid: event.uid,
            title: verified ? event.title.slice(1) : event.title,
            location: event.location ?? null,
            shortLocation: event.location ? shortenLocation(event.location) : null,
            description: event.description ? event.description : null,
            start: event.start.date,
            end: event.end.date,
            displayStart: event.start.date,
            displayEnd: event.end.date,
            color: null,
            allDay,
            verified,
            priority: null,
            maxPriority: null,
            multipart: null
          }
        })

      // remove all day events
      const filteredEvents = events.filter(({ allDay }) => !allDay)

      // split events spanning multiple days
      const splitEvents = filteredEvents.flatMap((event) => {
        if (isSameDay(event.start, event.end)) {
          return [event]
        } else if (event.end.getHours() === 0 && event.end.getMinutes() === 0) {
          return [event]
        } else {
          const series = dateRange(event.start, event.end).map(
            (day) =>
              [clampDate(event.start, nextDay(day), day), clampDate(day, event.end, nextDay(day))] as [Date, Date]
          )

          const events = series.map((_, index) => ({
            ...event,
            start: series[index][0],
            end: series[index][1],
            uuid: event.uuid + '-' + index, // TODO: needed right now because otherwise the modals break
            multipart: { index, series }
          }))

          return events
        }
      })

      return serialize(intervalGraphColoring(splitEvents))
    })

export { load, serialize, deserialize }
