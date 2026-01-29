import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

// Avoid brittle per-test icon mocks: any Lucide icon becomes a harmless <svg />.
jest.mock('lucide-react', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')

  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === '__esModule') return true
        return (props: Record<string, unknown>) =>
          React.createElement('svg', { 'data-lucide': String(prop), ...props })
      },
    }
  )
})
