export const MAX_FILE_SIZE = 50 * 1024 * 1024

export const ACCEPTED_EXTENSIONS = [
  'zip',
  'rar',
  'pdf',
  'docx',
  'xlsx',
  'png',
  'jpg',
  'jpeg',
] as const

export type AcceptedExtension = (typeof ACCEPTED_EXTENSIONS)[number]

export function isAcceptedExtension(ext: string): ext is AcceptedExtension {
  return (ACCEPTED_EXTENSIONS as readonly string[]).includes(ext.toLowerCase())
}

export function getAcceptAttribute(): string {
  return ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`).join(',')
}

export function describeAcceptedTypes(): string {
  return ACCEPTED_EXTENSIONS.filter((ext) => ext !== 'jpeg').join(' / ')
}
