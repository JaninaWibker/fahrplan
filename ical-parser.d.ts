declare module 'cal-parser' {
  type ICALEvent = {
    uid: { value: string }
    summary: { value: string }
    location: { value: string }
    description: { value: string }
    dtstart: { value: Date; params?: { value?: string } }
    dtend: { value: Date; params?: { value?: string } }
  }

  type ICALCalendarData = {
    dtstamp: Date
    created: Date
    'last-modified': Date
    sequence: { value: number }
  }

  function parseString(text: string): { events: ICALEvent[]; calendarData: ICALCalendarData }
}
