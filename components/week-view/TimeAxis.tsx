import { formatTime } from '@/utils/date'
import { HEIGHT_PER_HOUR } from '@/utils/constants'

export const TimeAxis = ({ hours }: { hours: Date[] }) => (
  <div className="flex h-fit w-[72px] select-none flex-col items-center">
    {hours.map((hour) => (
      <div
        key={hour.toISOString()}
        className="flex items-center justify-end text-right text-sm font-semibold text-gray-400"
        style={{ height: HEIGHT_PER_HOUR }}
      >
        <div className="mx-1 bg-white px-1">{formatTime(hour)}</div>
      </div>
    ))}
  </div>
)
