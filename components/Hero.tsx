import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-400 pt-16">
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          <span className="block">点子实验室</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-white/90">
          你的创意，我们来实现
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/submit"
            className="transform rounded-full border border-white/30 bg-white/20 px-8 py-3 text-lg font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-white/30 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 motion-reduce:transform-none motion-reduce:transition-none"
          >
            提交点子
          </Link>
          <Link
            href="#tools"
            className="transform rounded-full border-2 border-white bg-transparent px-8 py-3 text-lg font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:bg-white/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 motion-reduce:transform-none motion-reduce:transition-none"
          >
            浏览工具
          </Link>
        </div>
      </div>

      {/* Animated decorative orbs */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white/20 blur-3xl motion-reduce:animate-none animate-float-slow animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl motion-reduce:animate-none animate-float-slower animate-pulse-slow" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/20 blur-2xl motion-reduce:animate-none animate-float-slow" />
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <Link
          href="#tools"
          className="flex flex-col items-center text-white/80 transition-colors hover:text-white"
          aria-label="滚动到工具区域"
        >
          <span className="mb-2 text-sm">向下滚动</span>
          <ChevronDown className="h-6 w-6 animate-bounce motion-reduce:animate-none" />
        </Link>
      </div>
    </section>
  );
}
