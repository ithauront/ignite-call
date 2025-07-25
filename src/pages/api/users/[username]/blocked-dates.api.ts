import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end()
    }

    const username = String(req.query.username)
    const { year, month } = req.query

    if (!year || !month) {
      return res.status(400).json({ message: 'Year or month not specified.' })
    }

    const user = await prisma.user.findUnique({
      where: { userName: username },
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const availableWeekDays = await prisma.userTimeInterval.findMany({
      select: {
        week_day: true,
      },
      where: {
        user_id: user.id,
      },
    })

    const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
      return !availableWeekDays.some(
        (availableWeekDays) => availableWeekDays.week_day === weekDay,
      )
    })

    const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
  SELECT
    EXTRACT(DAY FROM S.DATE) AS date,
    COUNT(S.date),
    ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

  FROM schedulings S

  LEFT JOIN user_time_intervals UTI
    ON UTI.week_day = EXTRACT(DOW FROM S.date + INTERVAL '1 day')

  WHERE S.user_id = ${user.id}
    AND EXTRACT(YEAR FROM S.date) = ${year}::int
    AND EXTRACT(MONTH FROM S.date) = ${month}::int

  GROUP BY EXTRACT(DAY FROM S.DATE),
    ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

  HAVING
    COUNT(S.date) >= ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60);
`

    const blockedDates = blockedDatesRaw.map((item) => Number(item.date))

    return res.json({ blockedWeekDays, blockedDates })
  } catch (error) {
    console.error('API Error: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
