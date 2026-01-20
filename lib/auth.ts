import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'session'

export type SessionPayload = JWTPayload & {
  sub: string
  email: string
  role: string
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

export function setSessionCookie(token: string): void {
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
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
    return await verifyJWT(token)
  } catch {
    return null
  }
}
