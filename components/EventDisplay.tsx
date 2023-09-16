import { formatTime } from '../utils/date'
import type { Event } from '../utils/ical'

type EventDisplayProps = {
  event: Event
}

const EventDisplay = ({ event }: EventDisplayProps) => {
  return (
    <div>
      {event.location ? (
        <div className="flex flex-row">
          <span className="p-2 text-slate-600">{'Ort: '}</span>
          <span className="p-2">{event.location}</span>
        </div>
      ) : null}
      <div className="flex flex-row">
        <span className="p-2 text-slate-600">{'Zeit: '}</span>
        <span className="p-2">
          {formatTime(event.start)} - {formatTime(event.end)}
        </span>
      </div>
      {event.description ? <div className="p-2 " dangerouslySetInnerHTML={{ __html: event.description }} /> : null}
    </div>
  )
}

export default EventDisplay
