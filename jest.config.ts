import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    '<rootDir>/lib/auth.ts',
    '<rootDir>/lib/users.ts',
    '!<rootDir>/**/*.d.ts',
  ],
}

export default async () => {
  const config = await createJestConfig(customJestConfig)()

  // next/jest injects a broad `/node_modules/` ignore pattern which prevents
  // transforming ESM-only deps like jose. Override to only ignore everything
  // *except* jose.
  config.transformIgnorePatterns = [
    '/node_modules/(?!(jose)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ]

  return config
}
