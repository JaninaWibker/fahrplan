'use client'

import { useState } from 'react'
import { isEarlierDay } from '../utils/date'
import type { Event } from '../utils/ical'
import { Calendar } from './Calendar'
import { Header } from './Header'

type MainProps = {
  startingDay: Date
  endingDay: Date
  initialDay: Date
  events: Event[]
}

export const Main = ({ startingDay, endingDay, initialDay, events }: MainProps) => {
  const [date, setDate] = useState(initialDay)

  const canPrev = isEarlierDay(startingDay, date) // startingDate < date
  const canNext = isEarlierDay(date, endingDay) // date < endingDate

  const prev = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() - 1)
    setDate(newDate)
  }

  const next = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() + 1)
    setDate(newDate)
  }

  return (
    <>
      <Header date={date} onPrev={prev} onNext={next} canPrev={canPrev} canNext={canNext} />
      <Calendar events={events} date={date} />
    </>
  )
}
