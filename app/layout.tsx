import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Removed as per style guide (system-ui)
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

// const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "点子 Lab",
  description: "创意点子发现平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=Quicksand:wght@300;400;500;600;700&family=Ma+Shan+Zheng&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`antialiased bg-[#fdf8ff] text-slate-700 overflow-x-hidden font-sans`}>
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[1000] focus-visible:rounded-xl focus-visible:bg-white focus-visible:px-4 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-gray-900 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          跳转到主要内容
        </a>
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
