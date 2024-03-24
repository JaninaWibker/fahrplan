'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import { type DaysOfTheWeek, computeStartAndEndOfWeek, getWeekNumber, dateRange, isSameDay } from '@/utils/date'
import type { NativeProps } from '@/utils/types'

type HeaderProps = {
  date: Date
  activeDays: boolean[]
  startOfWeek: DaysOfTheWeek
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}

const RoundedOutline = ({ children, ...rest }: NativeProps<'div'>) => (
  <div className="flex h-9 min-w-24 justify-between rounded-full border-2 border-pink-200" {...rest}>
    {children}
  </div>
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RoundedOutlineButton = ({ children, ...rest }: NativeProps<'button'>) => (
  <button
    className="flex h-9 min-w-24 items-center justify-center rounded-full border-2 border-pink-200 px-4 text-sm font-semibold"
    {...rest}
  >
    {children}
  </button>
)

export const Header = ({ date, activeDays, startOfWeek, onPrev, onNext, canPrev, canNext }: HeaderProps) => {
  const { start, end } = computeStartAndEndOfWeek(date, startOfWeek)

  const days = dateRange(start, end).map((dayInWeek, i) => ({
    date: dayInWeek,
    hasEvents: activeDays[i],
    isToday: isSameDay(dayInWeek, new Date())
  }))

  return (
    <div className="w-full border-b border-gray-100 px-[72px] pb-3 pt-8 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="relative flex justify-between pb-8">
        <div className="flex items-center gap-4">
          <RoundedOutline>
            <button
              className={clsx('rounded-full p-1 pl-[9px]', canPrev ? 'text-black' : 'text-slate-300')}
              onClick={canPrev ? onPrev : undefined}
              disabled={!canPrev}
            >
              <ChevronLeft />
            </button>
            <button
              className={clsx('rounded-full p-1 pr-[9px]', canNext ? 'text-black' : 'text-slate-300')}
              onClick={canNext ? onNext : undefined}
              disabled={!canNext}
            >
              <ChevronRight />
            </button>
          </RoundedOutline>
          {/* <RoundedOutlineButton onClick={undefined}>Today</RoundedOutlineButton> */}
          <span className="text-sm font-semibold">Week {getWeekNumber(date)}</span>
        </div>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold">Fahrplan</h1>
        <div className="flex items-center gap-4">
          {/* <RoundedOutlineButton onClick={undefined}>More Information</RoundedOutlineButton> */}
        </div>
      </div>

      <div className="grid w-full select-none grid-cols-7 items-center justify-center gap-[2px]">
        {days.map(({ date, hasEvents, isToday }, i) => (
          <div key={i} className="flex w-full justify-center">
            <div
              className={clsx(
                'flex items-center gap-2 rounded-full border-2 px-4',
                isToday && hasEvents && 'border-pink-300 bg-pink-400',
                isToday && !hasEvents && 'border-pink-200 bg-pink-300',
                !isToday && 'border-transparent'
              )}
            >
              <span
                className={clsx(
                  'text-sm font-semibold',
                  isToday && 'text-white',
                  !isToday && hasEvents && 'text-pink-400',
                  !isToday && !hasEvents && 'text-gray-300'
                )}
              >
                {date.toLocaleDateString('de-DE', { weekday: 'short' })}
              </span>
              <span
                className={clsx(
                  'text-xl font-semibold',
                  isToday && 'text-white',
                  !isToday && hasEvents && 'text-gray-800',
                  !isToday && !hasEvents && 'text-gray-400'
                )}
              >
                {date.toLocaleDateString('de-DE', { day: 'numeric' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
