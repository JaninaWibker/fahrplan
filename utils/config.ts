export const getConfig = () => {
  const settings = {
    clampCurrentYear: process.env.DATE_RANGE_CLAMP_CURRENT_YEAR === 'true',
    clampStart: new Date(process.env.DATE_RANGE_CLAMP_START || ''),
    clampEnd: new Date(process.env.DATE_RANGE_CLAMP_END || ''),
    icalUrl: process.env.ICAL_URL,
    startOfWeek: process.env.START_OF_WEEK || 'monday'
  }

  return {
    clampCurrentYear: settings.clampCurrentYear,
    clampStart: Number.isNaN(settings.clampStart.getTime()) ? undefined : settings.clampStart,
    clampEnd: Number.isNaN(settings.clampEnd.getTime()) ? undefined : settings.clampEnd,
    icalUrl: settings.icalUrl,
    startOfWeek: settings.startOfWeek
  }
}
