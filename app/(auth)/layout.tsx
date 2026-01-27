import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-brand-bg font-sans text-brand-dark">
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
