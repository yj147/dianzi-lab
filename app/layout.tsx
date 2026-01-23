import type { Metadata } from "next";
import { Ma_Shan_Zheng, Quicksand, ZCOOL_KuaiLe } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-quicksand",
});

const zcoolKuaiLe = ZCOOL_KuaiLe({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-zcool",
});

const maShanZheng = Ma_Shan_Zheng({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-ma-shan-zheng",
});

export const metadata: Metadata = {
  title: "奇迹工坊",
  description: "点亮你的奇思妙想",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${quicksand.variable} ${zcoolKuaiLe.variable} ${maShanZheng.variable}`}
    >
      <body className="antialiased bg-[#fdf8ff] text-slate-700 overflow-x-hidden font-sans">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-xl focus-visible:bg-white focus-visible:px-4 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-gray-900 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          跳转到主要内容
        </a>
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
