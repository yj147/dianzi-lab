/**
 * @jest-environment node
 */

import { buildTemplate, getNestedA, getNestedAOrDefault } from '@/lib/nested-access'

describe('lib/nested-access', () => {
  it('buildTemplate: 生成字符串模板', () => {
    expect(buildTemplate('bar')).toBe('template bar')
  })

  it('getNestedA: 在输入满足不变式时直接返回 a', () => {
    expect(getNestedA({ nested: { a: 1 } })).toBe(1)
  })

  it('getNestedAOrDefault: input 缺失返回默认值 0', () => {
    expect(getNestedAOrDefault(undefined)).toBe(0)
  })

  it('getNestedAOrDefault: input 为 null 返回默认值 0', () => {
    expect(getNestedAOrDefault(null)).toBe(0)
  })

  it('getNestedAOrDefault: nested 缺失返回默认值 0', () => {
    expect(getNestedAOrDefault({})).toBe(0)
  })

  it('getNestedAOrDefault: nested 为 null 返回默认值 0', () => {
    expect(getNestedAOrDefault({ nested: null })).toBe(0)
  })

  it('getNestedAOrDefault: a 缺失返回默认值 0', () => {
    expect(getNestedAOrDefault({ nested: {} })).toBe(0)
  })

  it('getNestedAOrDefault: a 为 null 返回默认值 0', () => {
    expect(getNestedAOrDefault({ nested: { a: null } })).toBe(0)
  })

  it('getNestedAOrDefault: a=0 不应被错误兜底（区别于 ||）', () => {
    expect(getNestedAOrDefault({ nested: { a: 0 } }, 123)).toBe(0)
  })

  it('getNestedAOrDefault: a 存在时返回 a', () => {
    expect(getNestedAOrDefault({ nested: { a: 42 } })).toBe(42)
  })

  it('getNestedAOrDefault: 可指定非 0 默认值', () => {
    expect(getNestedAOrDefault(undefined, 7)).toBe(7)
  })
})
