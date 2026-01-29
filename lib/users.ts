import type { User } from '@prisma/client'

import { prisma } from '@/lib/db'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function createUser(
  email: string,
  hashedPassword: string
): Promise<User> {
  const normalizedEmail = normalizeEmail(email)

  return prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash: hashedPassword,
    },
  })
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const normalizedEmail = normalizeEmail(email)

  return prisma.user.findUnique({
    where: { email: normalizedEmail },
  })
}
