import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const adminEmailRaw = process.env.SEED_ADMIN_EMAIL
  const adminPasswordRaw = process.env.SEED_ADMIN_PASSWORD

  // Treat hosted deployments as hardened environments: never allow implicit/default seed credentials.
  const isHardenedDeployment =
    process.env.VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'preview' ||
    (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production')

  if (isHardenedDeployment) {
    if (!adminEmailRaw || !adminPasswordRaw) {
      throw new Error(
        'Missing SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD. Refusing to seed admin in hardened deployments.'
      )
    }
    if (adminPasswordRaw === 'admin123') {
      throw new Error(
        'Refusing to seed admin with default password "admin123" in hardened deployments.'
      )
    }
  }

  const adminEmail = (adminEmailRaw || 'admin@dianzi.com').trim().toLowerCase()
  const adminPasswordPlain = adminPasswordRaw || 'admin123'
  const adminPasswordHash = await bcrypt.hash(adminPasswordPlain, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      ...(adminPasswordRaw ? { passwordHash: adminPasswordHash } : {}),
    },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  })

  console.log('Seed completed:', admin.email, '(id:', admin.id, ')')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
