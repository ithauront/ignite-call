import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, userName } = req.body

  const userExists = await prisma.user.findUnique({
    where: {
      userName,
    },
  })

  if (userExists) {
    return res.status(400).json({
      message: 'User name already taken',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      userName,
    },
  })
  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return res.status(201).json(user)
}
