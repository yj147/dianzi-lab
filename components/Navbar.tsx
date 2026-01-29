import { getSession } from '@/lib/auth'
import NavbarClient from './NavbarClient'

export default async function Navbar() {
  const session = await getSession()

  return (
    <NavbarClient
      isLoggedIn={!!session}
      userEmail={session?.email}
      userRole={session?.role}
    />
  )
}
