import React from 'react'
import ChevronLeft from '../icons/ChevronLeft'
import ChevronRight from '../icons/ChevronRight'
import { formatDate } from '../utils/date'

type HeaderProps = {
  date: Date,
  onPrev: () => void,
  onNext: () => void,
  canPrev: boolean,
  canNext: boolean
}

const Header = ({ date, onPrev, onNext, canPrev, canNext }: HeaderProps) => {
  return (
    <div className="">
      <h1 className="p-4 text-4xl font-semibold">Fahrplan</h1>

      <div className="flex">
        <div className={'p-4 rounded-full ' + (canPrev ? 'text-black' : 'text-slate-300')} onClick={canPrev ? onPrev : undefined}><ChevronLeft style={{ width: 36, height: 36 }} /></div>
        <div className="grow text-2xl font-semibold text-center leading-[calc(36px+2rem)]">
          {date.toLocaleDateString('de-DE', { weekday: 'short' })} - {formatDate(date)}
        </div>
        <div className={'p-4 rounded-full ' + (canNext ? 'text-black' : 'text-slate-300')} onClick={canNext ? onNext : undefined}><ChevronRight style={{ width: 36, height: 36 }} /></div>
      </div>
    </div>
  )
}

export default Header
