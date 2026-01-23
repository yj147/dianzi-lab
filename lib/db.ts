import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function withSchema(databaseUrl: string, schema: string): string {
  const url = new URL(databaseUrl)
  url.searchParams.set('schema', schema)
  return url.toString()
}

function createPrismaClient(): PrismaClient {
  const isVercelDeployment = process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV)

  const configuredSchema = isVercelDeployment ? process.env.DATABASE_SCHEMA?.trim() : undefined
  const schema =
    configuredSchema || (process.env.VERCEL_ENV === 'preview' ? 'preview' : undefined)

  // Vercel preview deployments should never share the production schema.
  // Some claimable deployments don't expose VERCEL_ENV; DATABASE_SCHEMA provides an explicit override.
  if (schema) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set')
    }

    return new PrismaClient({
      datasources: {
        db: {
          url: withSchema(databaseUrl, schema),
        },
      },
    })
  }

  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
