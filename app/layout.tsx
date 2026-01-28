import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  display: "swap",
  variable: "--font-heading",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Bambi Lab Idea",
  description: "让好点子不再只是想法",
};

const themeInitScript = `
(() => {
  try {
    const storageKey = 'theme';
    const classNameDark = 'dark';
    const root = document.documentElement;

    const stored = localStorage.getItem(storageKey);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (stored === 'system' && systemDark) || (!stored && systemDark);

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
      className={`${dmSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased bg-background text-foreground overflow-x-hidden font-sans">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-xl focus-visible:bg-surface focus-visible:px-4 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-foreground focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
