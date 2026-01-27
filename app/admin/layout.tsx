import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AdminNav from '@/app/admin/_components/AdminNav'

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
      <div className="relative z-10">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <AdminNav className="mb-8" />
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
