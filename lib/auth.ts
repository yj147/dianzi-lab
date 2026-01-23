import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export type SessionPayload = JWTPayload & {
  sub: string
  email: string
  role: string
}

const VERIFIED_SESSION_CACHE_MAX = 500
const verifiedSessionCache = new Map<string, SessionPayload>()

function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not set')
  }

  return new TextEncoder().encode(secret)
}

export async function signJWT(payload: {
  sub: string
  email: string
  role: string
}): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecretKey())
}

export async function verifyJWT(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, getJwtSecretKey(), {
    algorithms: ['HS256'],
  })

  if (
    typeof payload.sub !== 'string' ||
    typeof payload.email !== 'string' ||
    typeof payload.role !== 'string'
  ) {
    throw new Error('Invalid session payload')
  }

  return payload as SessionPayload
}

async function verifyJWTWithCache(token: string): Promise<SessionPayload> {
  const cached = verifiedSessionCache.get(token)
  if (cached) {
    if (typeof cached.exp === 'number' && cached.exp <= nowInSeconds()) {
      verifiedSessionCache.delete(token)
    } else {
      return cached
    }
  }

  const payload = await verifyJWT(token)

  // Avoid unbounded growth. This is a tiny app; keep it simple.
  if (verifiedSessionCache.size >= VERIFIED_SESSION_CACHE_MAX) {
    verifiedSessionCache.clear()
  }

  verifiedSessionCache.set(token, payload)
  return payload
}

export function setSessionCookie(token: string): void {
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export function clearSessionCookie(): void {
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value
  if (!token) {
    return null
  }

  try {
    return await verifyJWTWithCache(token)
  } catch {
    return null
  }
}
