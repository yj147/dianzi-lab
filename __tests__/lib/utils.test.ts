import { noop } from '@/lib/utils'

describe('lib/utils', () => {
  it('noop 返回 undefined', () => {
    expect(noop()).toBeUndefined()
  })
})

