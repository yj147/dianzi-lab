import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/.worktrees/'],
  testPathIgnorePatterns: ['<rootDir>/.worktrees/'],
  watchPathIgnorePatterns: ['<rootDir>/.worktrees/'],
  collectCoverageFrom: [
    '<rootDir>/components/**/*.{ts,tsx}',
    '!<rootDir>/components/**/*.stories.tsx',
    '!<rootDir>/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
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
