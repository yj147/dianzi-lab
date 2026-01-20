import type { User } from '@prisma/client'

import { prisma } from '@/lib/db'

export async function createUser(
  email: string,
  hashedPassword: string,
): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase()

  return prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash: hashedPassword,
    },
  })
}
