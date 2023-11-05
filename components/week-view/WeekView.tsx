import type { Event } from '@/utils/ical'
import type { DaysOfTheWeek } from '@/utils/date'

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
  return undefined
}
