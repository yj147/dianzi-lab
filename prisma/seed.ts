import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dianzi.com' },
    update: {},
    create: {
      email: 'admin@dianzi.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('Seed completed: admin@dianzi.com (id:', admin.id, ')')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
