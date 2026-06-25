import 'server-only'
import { cache } from 'react'
import { prisma } from './prisma'
import { getSession } from './session'

export const verifySession = cache(async () => {
  const session = await getSession()
  if (!session?.userId) {
    return null
  }
  return session
})

export const getCurrentUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      role: true,
      avatar: true,
      bio: true,
      phone: true,
      wilaya: true,
      title: true,
    },
  })

  return user
})

export const getUserProfile = cache(async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      competencies: {
        include: {
          category: true,
          specialty: true,
        },
      },
      reviewsReceived: {
        include: {
          reviewer: {
            select: { id: true, name: true, avatar: true },
          },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  return user
})

export async function searchUsers(params: {
  query?: string
  wilaya?: string
  specialtyId?: string
  categoryId?: string
  page?: number
  limit?: number
}) {
  const { query, wilaya, specialtyId, categoryId, page = 1, limit = 20 } = params
  const skip = (page - 1) * limit

  const where: any = { isActive: true }

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { nameArabic: { contains: query } },
      { bio: { contains: query } },
      { title: { contains: query } },
    ]
  }

  if (wilaya) {
    where.wilaya = wilaya
  }

  if (specialtyId || categoryId) {
    where.competencies = {
      some: {
        ...(specialtyId ? { specialtyId } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
    }
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        surname: true,
        nameArabic: true,
        avatar: true,
        title: true,
        wilaya: true,
        ratingAvg: true,
        ratingCount: true,
        bio: true,
        competencies: {
          include: {
            specialty: true,
            category: true,
          },
          take: 3,
        },
      },
      skip,
      take: limit,
      orderBy: { ratingAvg: 'desc' },
    }),
    prisma.user.count({ where }),
  ])

  return { users, total, page, totalPages: Math.ceil(total / limit) }
}
