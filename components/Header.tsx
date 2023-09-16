'use clientl'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '../utils/date'

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
        <div
          className={'p-2 rounded-full ' + (canPrev ? 'text-black' : 'text-slate-300')}
          onClick={canPrev ? onPrev : undefined}
        >
          <ChevronLeft style={{ width: 32, height: 32 }} />
        </div>
        <div className="grow text-center text-xl font-semibold">
          {date.toLocaleDateString('de-DE', { weekday: 'short' })} - {formatDate(date)}
        </div>
        <div
          className={'p-2 rounded-full ' + (canNext ? 'text-black' : 'text-slate-300')}
          onClick={canNext ? onNext : undefined}
        >
          <ChevronRight style={{ width: 32, height: 32 }} />
        </div>
      </div>
    </div>
  )
}
