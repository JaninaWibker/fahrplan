import ical from 'cal-parser'

export type Event = {
  uuid: string,
  title: string,
  location: string,
  description?: string,
  start: Date,
  end: Date,
  color?: string // TODO: currently unused
}

export type SerializedEvent = {
  uuid: string,
  title: string,
  location: string,
  description?: string,
  start: string,
  end: string,
  color?: string // TODO: currently unused
}

// https://calendar.google.com/calendar/ical/903e162de81a5fbd1a1777760f8858ff6c2555398b8a1649f7bc86ccd6e2845a%40group.calendar.google.com/public/basic.ics
// localhost:3000/public/basic.ics

const load = (url: string): Promise<SerializedEvent[]> => fetch(url)
  .then(res => res.text())
  .then(text => {
    const { events: icalEvents, calendarData } = ical.parseString(text)
    const events = icalEvents.map(event => ({
      uuid: event.uid.value,
      title: event.summary.value,
      location: event.location.value,
      description: event.description ? event.description.value : null,
      start: event.dtstart.value.toISOString(),
      end: event.dtend.value.toISOString(),
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

    return events
  })

export {
  load
}
