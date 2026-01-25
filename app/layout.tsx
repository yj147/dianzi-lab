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

const themeInitScript = `
(() => {
  try {
    const storageKey = 'theme';
    const classNameDark = 'dark';
    const root = document.documentElement;

    const stored = localStorage.getItem(storageKey);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (stored !== 'light' && systemDark);

    root.classList.toggle(classNameDark, isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
  } catch {
    // ignore
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${quicksand.variable} ${zcoolKuaiLe.variable} ${maShanZheng.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased bg-background text-foreground overflow-x-hidden font-sans">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-xl focus-visible:bg-white focus-visible:px-4 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-gray-900 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:bg-slate-900 dark:focus-visible:text-slate-50"
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
