import { prisma } from '@/lib/db'

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { ideas: true } },
    },
  })
}
