import ical from 'cal-parser'

export type Event = {
  uuid: string
  title: string
  location: string | null
  short_location: string | null
  description: string | null
  start: Date
  end: Date
  color: string | null // TODO: currently unused
  priority: number
  max_priority: number
}

export type SerializedEvent = {
  uuid: string
  title: string
  location: string | null
  short_location: string | null
  description: string | null
  start: string
  end: string
  color: string | null // TODO: currently unused
  priority: number
  max_priority: number
}

const intervalGraphColoring = (events: Omit<Event, 'priority' | 'max_priority'>[]): Event[] => {
  const sortedEntries = events
    .flatMap((event) => [
      { type: 'start', time: event.start.getTime(), uuid: event.uuid },
      { type: 'end', time: event.end.getTime(), uuid: event.uuid }
    ])
    .sort((a, b) => {
      if (a.time === b.time) {
        return a.type === 'end' ? -1 : 1
      } else {
        return a.time - b.time
      }
    })

  // proper shape, makes modifications easier
  const entries = sortedEntries.map((entry) => ({ ...entry, priority: 0, max_priority: 0 }))

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
        entry.max_priority = Math.max(entry.max_priority, maxPriority)
      })
      stack = stack.filter(({ uuid }) => uuid !== entry.uuid)
    }
  }

  return entries
    .filter((entry) => entry.type === 'start')
    .map((entry) => {
      const event: Omit<Event, 'priority' | 'max_priority'> = events.find((event) => event.uuid === entry.uuid) as Omit<
        Event,
        'priority' | 'max_priority'
      >
      return { ...event, priority: entry.priority + 1, max_priority: entry.max_priority + 1 }
    })
}

const serialize = (events: Event[]): SerializedEvent[] =>
  events.map((event) => ({
    ...event,
    start: event.start.toISOString(),
    end: event.end.toISOString()
  }))

const deserialize = (events: SerializedEvent[]): Event[] =>
  events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end)
  }))

const shortenLocation = (location: string) => {
  return location.split(',')[0]
}

const load = (url: string): Promise<SerializedEvent[]> =>
  fetch(url, { next: { revalidate: 600 } })
    .then((res) => res.text())
    .then((text) => {
      const { events: icalEvents, calendarData } = ical.parseString(text)

      const events: (Omit<Event, 'priority' | 'max_priority'> & { priority: null; max_priority: null })[] =
        icalEvents.map((event) => ({
          uuid: event.uid.value,
          title: event.summary.value,
          location: event.location ? event.location.value : null,
          short_location: event.location ? shortenLocation(event.location.value) : null,
          description: event.description ? event.description.value : null,
          start: event.dtstart.value,
          end: event.dtend.value,
          color: null,
          priority: null,
          max_priority: null
        }))

      // unused for now
      // {
      //   dtstamp: 2022-10-15T10:02:05.000Z,
      //   created: 2022-10-15T04:49:31.000Z,
      //   'last-modified': 2022-10-15T04:54:46.000Z,
      //   sequence: [Object],
      //   status: [Object],
      //   transp: [Object]
      // }

      return serialize(intervalGraphColoring(events))
    })

export { load, serialize, deserialize }
