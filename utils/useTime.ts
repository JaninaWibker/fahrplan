import { useEffect, useState, useRef } from 'react'

export const useTime = (refreshTime = 1000): [Date, true] | [undefined, false] => {
  const [time, setTime] = useState<{ ready: false; time: undefined } | { ready: true; time: Date }>({
    ready: false,
    time: undefined
  })
  const interval = useRef<number | undefined>(undefined)

  useEffect(() => {
    setTime({ ready: true, time: new Date() })

    interval.current = setInterval(() => {
      setTime({ ready: true, time: new Date() })
    }, refreshTime) as unknown as number

    return () => {
      clearInterval(interval.current)
    }
  }, [refreshTime, setTime])

  return [time.time, time.ready] as [Date, true] | [undefined, false]
}
