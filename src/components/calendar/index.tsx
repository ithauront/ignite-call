import { CaretLeft, CaretRight } from 'phosphor-react'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'
import { getWeekDay } from '../../utils/get-week-day'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/axios'
import { useRouter } from 'next/router'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const router = useRouter()

  const username = String(router.query.username)

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonthDate)
  }
  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month')

    setCurrentDate(nextMonthDate)
  }

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')
  const shortWeekDays = getWeekDay({ short: true })

  const { data: blockedDates } = useQuery<BlockedDates>(
    ['blocked-dates', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: (currentDate.get('month') + 1).toString().padStart(2, '0'),
        },
      })

      return response.data
    },
  )

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })
    const firstWeekDay = currentDate.get('day')
    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get('day')) ||
            blockedDates.blockedDates.includes(date.get('date')),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isWeekNew = i % 7 === 0

        if (isWeekNew) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }
        return weeks
      },
      [],
    )
    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekday) => (
              <th key={weekday}>{weekday}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay
                        onClick={() => onDateSelected(date.toDate())}
                        disabled={disabled}
                      >
                        {date.get('date')}
                      </CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
