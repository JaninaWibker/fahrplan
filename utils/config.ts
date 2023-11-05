import { DAYS_OF_THE_WEEK, type DaysOfTheWeek } from '@/utils/date'

export const getConfig = () => {
  const settings = {
    clampCurrentYear: process.env.DATE_RANGE_CLAMP_CURRENT_YEAR === 'true',
    clampStart: new Date(process.env.DATE_RANGE_CLAMP_START || ''),
    clampEnd: new Date(process.env.DATE_RANGE_CLAMP_END || ''),
    icalUrl: process.env.ICAL_URL,
    startOfWeek: process.env.START_OF_WEEK || 'monday'
  }

  if (!(DAYS_OF_THE_WEEK as unknown as string[]).includes(settings.startOfWeek)) {
    throw new Error(`Invalid start of week: ${settings.startOfWeek}`)
  }

  return {
    clampCurrentYear: settings.clampCurrentYear,
    clampStart: Number.isNaN(settings.clampStart.getTime()) ? undefined : settings.clampStart,
    clampEnd: Number.isNaN(settings.clampEnd.getTime()) ? undefined : settings.clampEnd,
    icalUrl: settings.icalUrl,
    startOfWeek: settings.startOfWeek as DaysOfTheWeek
  }
}
