import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-white pt-24 pb-16">
      <div className="relative z-10 mx-auto max-w-[1152px] px-6 text-center lg:px-8">
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl">
          <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent pb-2">点子实验室</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground leading-relaxed sm:text-2xl">
          你的创意，我们来实现
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Button asChild size="lg" className="h-14 rounded-full bg-[var(--cta)] px-10 text-lg font-semibold text-gray-900 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg active:translate-y-0">
            <Link href="/submit">
              提交点子
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="h-14 rounded-full border border-white/20 bg-white/20 px-10 text-lg font-medium backdrop-blur-md transition-all hover:bg-white/40 hover:-translate-y-1">
            <Link href="#tools">
              浏览工具
            </Link>
          </Button>
        </div>
      </div>

      {/* Animated decorative orbs - Foggy & Subtle */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -left-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[120px] animate-float-slow opacity-60" />
        <div className="absolute -right-[10%] bottom-[10%] h-[600px] w-[600px] rounded-full bg-indigo-400/10 blur-[140px] animate-float-slower opacity-50" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] animate-pulse-slow" />
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <Link
          href="#tools"
          className="flex flex-col items-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-2"
          aria-label="滚动到工具区域"
        >
          <span className="mb-2 text-sm font-medium tracking-wide">向下滚动</span>
          <ChevronDown className="h-6 w-6 animate-bounce opacity-70" />
        </Link>
      </div>
    </section>
  );
}
