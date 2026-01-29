export type NestedAccessInput = {
  nested?: {
    a?: number | null
  } | null
}

export function buildTemplate(value: string): string {
  return `template ${value}`
}

export function getNestedAOrDefault(
  input: NestedAccessInput | null | undefined,
  defaultValue = 0
): number {
  return input?.nested?.a ?? defaultValue
}

export function getNestedA(input: { nested: { a: number } }): number {
  return input.nested.a
}
