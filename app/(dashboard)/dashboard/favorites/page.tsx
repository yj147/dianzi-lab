import Link from 'next/link'

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="glass-panel rounded-[3rem] p-10 text-center">
        <h1 className="text-balance mb-3 text-4xl font-script text-slate-800 md:text-5xl">灵感收藏</h1>
        <p className="text-pretty mx-auto mb-8 max-w-md font-medium text-slate-500">
          这里会收纳你珍藏的灵感碎片。现在还在编织中。
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full bg-coral-400 px-8 py-3 font-bold text-white shadow-lg shadow-coral-200 transition-transform hover:-translate-y-1 hover:bg-coral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff]"
        >
          返回我的梦境
        </Link>
      </div>
    </div>
  )
}

