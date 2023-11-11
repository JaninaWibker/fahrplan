import type { Event } from '@/utils/ical'
import type { DaysOfTheWeek } from '@/utils/date'
import { TimeAxis } from '@/components/TimeAxis'

type WeekViewProps = {
  currentDate: Date
  eventsPerWeekDay: Event[][]
  activeDays: boolean[]
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
  currentDate,
  eventsPerWeekDay,
  activeDays,
  startOfWeek,
  hoursToDisplay,
  activeEventId,
  onActiveEventIdChange
}: WeekViewProps) => {
  console.log({
    currentDate,
    eventsPerWeekDay,
    activeDays,
    startOfWeek,
    hoursToDisplay,
    activeEventId,
    onActiveEventIdChange
  })
  return (
    <div className={`flex max-h-[calc(100vh-145px)] overflow-y-scroll`}>
      {/* time axis */}
      <div className="h-fit w-[72px] shrink-0">
        <TimeAxis hours={hoursToDisplay} />
      </div>

      {/* day columns */}
      <div className="grid w-full grid-cols-7 divide-x-[2px] divide-solid divide-gray-200 border-x-[2px] border-gray-200">
        <div className="">1</div>
        <div className="">2</div>
        <div className="">3</div>
        <div className="">4</div>
        <div className="">5</div>
        <div className="">6</div>
        <div className="">7</div>
      </div>

      {/* current time */}
      <div className="h-fit w-[72px] shrink-0">2</div>
    </div>
  )
}
