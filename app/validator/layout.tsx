import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RouteTransition from '@/components/RouteTransition'

export default function ValidatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-brand-bg font-sans text-brand-dark">
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="relative z-10">
        <Navbar />
        <main>
          <RouteTransition>{children}</RouteTransition>
        </main>
        <Footer />
      </div>
    </div>
  )
}
