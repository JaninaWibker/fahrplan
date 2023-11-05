'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import { formatDate } from '@/utils/date'

type HeaderProps = {
  date: Date
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}

export const Header = ({ date, onPrev, onNext, canPrev, canNext }: HeaderProps) => {
  return (
    <div className="">
      <h1 className="px-4 pb-2 pt-4 text-3xl font-semibold">Fahrplan</h1>

      <div className="flex items-center">
        <button
          className={clsx('rounded-full p-2 ', canPrev ? 'text-black' : 'text-slate-300')}
          onClick={canPrev ? onPrev : undefined}
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <div className="grow text-center text-xl font-semibold">
          {date.toLocaleDateString('de-DE', { weekday: 'short' })} - {formatDate(date)}
        </div>
        <button
          className={clsx('rounded-full p-2 ', canNext ? 'text-black' : 'text-slate-300')}
          onClick={canNext ? onNext : undefined}
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </div>
  )
}
