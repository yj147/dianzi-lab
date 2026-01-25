import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminTopNav from './_components/AdminTopNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background text-foreground">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] blob-shape bg-lavender-100/60 blur-3xl opacity-60 animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] blob-shape bg-mint-100/60 blur-3xl opacity-60" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] blob-shape bg-coral-400/10 blur-3xl opacity-40" />
      </div>

      <AdminTopNav userEmail={session.email} />

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
