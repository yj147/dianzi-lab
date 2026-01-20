describe('lib/db', () => {
  it('在非生产环境缓存 prisma 实例到 globalThis', async () => {
    jest.resetModules()

    const originalGlobalPrisma = (globalThis as unknown as { prisma?: unknown })
      .prisma
    delete (globalThis as unknown as { prisma?: unknown }).prisma

    const PrismaClient = jest.fn(() => ({ tag: 'prisma' }))
    jest.doMock('@prisma/client', () => ({ PrismaClient }))

    const { prisma } = await import('@/lib/db')

    expect(PrismaClient).toHaveBeenCalledTimes(1)
    expect(prisma).toEqual({ tag: 'prisma' })
    expect((globalThis as unknown as { prisma?: unknown }).prisma).toEqual({
      tag: 'prisma',
    })

    if (originalGlobalPrisma === undefined) {
      delete (globalThis as unknown as { prisma?: unknown }).prisma
      return
    }

    ;(globalThis as unknown as { prisma?: unknown }).prisma = originalGlobalPrisma
  })
})

