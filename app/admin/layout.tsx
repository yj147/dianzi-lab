import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminSidebar from './_components/AdminSidebar';
import AdminHeader from './_components/AdminHeader';

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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <AdminSidebar 
        userEmail={session.email} 
        className="hidden md:flex fixed inset-y-0" 
      />

      <div className="flex flex-1 flex-col md:pl-60">
        <AdminHeader userEmail={session.email} />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
