import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] blob-shape bg-lavender-100/50 blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] blob-shape bg-mint-100/50 blur-3xl opacity-60" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] blob-shape bg-coral-400/10 blur-3xl opacity-40" />

        <div className="sparkle-dot w-2 h-2 top-1/4 left-1/4" />
        <div className="sparkle-dot w-3 h-3 top-1/3 right-1/4" />
        <div className="sparkle-dot w-1.5 h-1.5 bottom-1/4 left-1/2" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
