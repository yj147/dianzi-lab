import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RouteTransition from '@/components/RouteTransition'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-brand-bg font-sans text-brand-dark">
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <Navbar />
        <main className="container mx-auto flex-1 px-4 py-12">
          <RouteTransition>{children}</RouteTransition>
        </main>
        <Footer />
      </div>
    </div>
  )
}
