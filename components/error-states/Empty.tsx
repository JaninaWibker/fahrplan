import { computeDateRangeClamp } from '@/utils/config'

export const Empty = () => {
  const { min, max } = computeDateRangeClamp()
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Your calendar is empty 🤷🏻</h1>
      <p className="pt-1 text-gray-500">There are no events to show.</p>
      {min !== undefined && max !== undefined && (
        <>
          <p className="pt-8 text-gray-700">
            The calendar is configured to be clamped between <strong>{min.toLocaleDateString()}</strong> and{' '}
            <strong>{max.toLocaleDateString()}</strong>.
            <br />
            Try widening the date range, maybe the issue is just timezones.
          </p>
          <pre className="pt-4 text-sm">
            <code>{JSON.stringify({ min, max }, null, 2)}</code>
          </pre>
        </>
      )}
      <p className="pt-4 text-gray-700">Note that all day events are not supported and will not be shown.</p>
    </div>
  )
}
