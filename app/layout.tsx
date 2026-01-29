import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '500', '700'],
  display: 'swap',
  variable: '--font-heading',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Bambi Lab Idea',
  description: '让好点子不再只是想法',
}

const themeInitScript = `
	(() => {
	  try {
	    const storageKey = 'theme';
	    const classNameDark = 'dark';
	    const root = document.documentElement;
	    const SUN_TIMES_CACHE_KEY = 'sun_times';
	    const CACHE_DURATION = 24 * 60 * 60 * 1000;
	
	    function getCachedSunTimes() {
	      try {
	        const cached = localStorage.getItem(SUN_TIMES_CACHE_KEY);
	        if (!cached) return null;
	        const data = JSON.parse(cached);
	        const now = Date.now();
	        const today = new Date().toLocaleDateString('en-CA');
	        if (
	          typeof data.sunriseMs !== 'number' ||
	          typeof data.sunsetMs !== 'number' ||
	          typeof data.timestamp !== 'number' ||
	          typeof data.date !== 'string' ||
	          isNaN(data.sunriseMs) ||
	          isNaN(data.sunsetMs) ||
	          !Number.isFinite(data.timestamp) ||
	          now - data.timestamp > CACHE_DURATION ||
	          data.date !== today
	        ) {
	          localStorage.removeItem(SUN_TIMES_CACHE_KEY);
	          return null;
	        }
	        return data;
	      } catch {
	        return null;
	      }
	    }

    function isDarkTime() {
      const cached = getCachedSunTimes();
      if (!cached) {
        const hour = new Date().getHours();
        return hour < 6 || hour >= 18;
      }
      const now = Date.now();
      return now < cached.sunriseMs || now >= cached.sunsetMs;
    }

    let stored = localStorage.getItem(storageKey);
    if (stored && stored !== 'light' && stored !== 'dark' && stored !== 'auto') {
      stored = 'auto';
      localStorage.setItem(storageKey, stored);
    }

    const isDark = stored === 'dark' || (stored === 'auto' && isDarkTime()) || (!stored && isDarkTime());

    root.classList.toggle(classNameDark, isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
  } catch {
    // ignore
  }
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
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
  )
}
