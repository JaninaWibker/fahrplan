import { formatTime } from '@/utils/date'
import { HEIGHT_PER_HOUR } from '@/utils/constants'

export const TimeAxis = ({ hours }: { hours: Date[] }) => (
  <div className="h-fit w-14">
    {hours.map((hour) => (
      <div
        key={hour.toISOString()}
        className="relative flex items-center justify-end text-right text-sm font-medium text-gray-400"
        style={{ height: HEIGHT_PER_HOUR }}
      >
        <div className="mx-1 bg-white px-1">{formatTime(hour)}</div>
      </div>
    ))}
  </div>
)
