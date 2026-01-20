import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-cyan-700 to-white pt-16">
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          <span className="block">点子实验室</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-white/90">
          你的创意，我们来实现
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/submit"
            className="transform rounded-full bg-white px-8 py-3 text-lg font-semibold text-blue-600 shadow-md transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
          >
            提交点子
          </Link>
          <Link
            href="#tools"
            className="transform rounded-full border-2 border-white bg-transparent px-8 py-3 text-lg font-semibold text-white transition-all hover:scale-105 hover:bg-white/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
          >
            浏览工具
          </Link>
        </div>
      </div>

      {/* Decorative elements (optional, can help with LCP if kept simple) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
      </div>
    </section>
  );
}
