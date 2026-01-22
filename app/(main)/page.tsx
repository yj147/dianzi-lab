import Link from 'next/link';
import IdeaCard from "@/components/IdeaCard";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";

async function getCompletedIdeas() {
  return prisma.idea.findMany({
    where: { status: "COMPLETED", isDeleted: false },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, description: true, tags: true },
  });
}

export default async function Home() {
  const ideas = await getCompletedIdeas();

  return (
    <main className="relative z-10 min-h-screen overflow-hidden text-slate-700">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] blob-shape bg-lavender-100/50 blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] blob-shape bg-mint-100/50 blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] blob-shape bg-coral-400/10 blur-3xl opacity-40"></div>
        <div className="sparkle-dot w-2 h-2 top-1/4 left-1/4"></div>
        <div className="sparkle-dot w-3 h-3 top-1/3 right-1/4"></div>
        <div className="sparkle-dot w-1.5 h-1.5 bottom-1/4 left-1/2"></div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-32 text-center relative z-10">
        <div className="inline-block mb-6 px-4 py-1.5 bg-mint-100 text-emerald-600 rounded-full text-sm font-bold border border-emerald-200">
          ✨ 欢迎来到造梦者的集散地
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-8">
          <span className="script-title block mb-4">点亮你的</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-lavender-300 via-coral-400 to-mint-200 drop-shadow-sm">奇思妙想</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-500 font-medium mb-12 leading-relaxed">
          在这里，每一个古怪的念头都能编织成现实。
          <br />和志同道合的探索者一起，在梦境中构建奇迹。
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link href="/submit" className="group bg-lavender-300 text-white text-xl font-bold px-10 py-5 rounded-full shadow-2xl shadow-lavender-300/40 hover:bg-lavender-400 transition-all transform hover:-rotate-2 hover:scale-110 flex items-center gap-3">
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">temp_preferences_custom</span>
            编织梦想
          </Link>
          <a href="#tools" className="bg-white/80 text-slate-600 text-xl font-bold px-10 py-5 rounded-full border-2 border-dashed border-mint-200 hover:bg-white hover:border-mint-300 transition-all flex items-center gap-3">
            <span className="material-symbols-outlined text-mint-200">explore</span>
            探索奇迹工坊
          </a>
        </div>
        <div className="absolute -left-10 top-1/4 opacity-20 hidden lg:block">
          <span className="material-symbols-outlined text-[12rem] text-lavender-300">toys_fan</span>
        </div>
        <div className="absolute -right-10 bottom-0 opacity-20 hidden lg:block">
          <span className="material-symbols-outlined text-[15rem] text-mint-200">wind_power</span>
        </div>
      </section>

      {/* Dream Warehouse (Tools Section) */}
      <section id="tools" className="max-w-6xl mx-auto px-6 organic-overlap relative z-10">
        <div className="floating-card p-12 relative overflow-hidden min-h-[500px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-coral-400/5 blob-shape -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-left">
              <h2 className="text-4xl font-bold text-slate-800 mb-2">梦境仓库</h2>
              <p className="text-slate-500 font-medium">那些已经被赋予生命的奇妙装置...</p>
            </div>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-coral-400 p-3 bg-coral-50 rounded-full cursor-pointer hover:bg-coral-100 transition-colors">filter_vintage</span>
              <span className="material-symbols-outlined text-lavender-300 p-3 bg-lavender-50 rounded-full cursor-pointer hover:bg-lavender-100 transition-colors">search</span>
            </div>
          </div>

          {ideas.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative z-10">
              {ideas.map((idea) => (
                <div key={idea.id} className="h-full">
                  {/* Note: IdeaCard might need style adjustments for transparency, but putting it in container for now */}
                  <IdeaCard idea={idea} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center relative z-10">
              <div className="relative mb-10">
                <div className="w-48 h-48 bg-mint-50 rounded-full flex items-center justify-center border-4 border-dashed border-mint-200 animate-pulse">
                  <span className="material-symbols-outlined text-8xl text-mint-200">bedroom_baby</span>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center rotate-12">
                  <span className="material-symbols-outlined text-coral-400">nest_cam_magnet_mount</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">梦境还在孵化中...</h3>
              <p className="max-w-md text-slate-400 font-medium text-lg mb-10">
                这片区域正虚位以待。
                <br />快来释放你的想象力，成为第一个播种奇迹的人！
              </p>
              <Link href="/submit" className="bg-mint-200 text-emerald-800 font-black px-12 py-5 rounded-3xl border-b-8 border-mint-300 hover:border-b-4 hover:translate-y-1 transition-all text-xl">
                播撒第一颗种子
              </Link>
            </div>
          )}
          <div className="absolute bottom-4 right-10 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-lavender-200"></div>
            <div className="w-2 h-2 rounded-full bg-mint-200"></div>
            <div className="w-2 h-2 rounded-full bg-coral-400"></div>
          </div>
        </div>
      </section>

      {/* Infinite Bubbles Features */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        <div className="bg-lavender-50/80 p-10 rounded-[3rem] transform hover:-rotate-2 transition-transform border-2 border-lavender-100">
          <span className="material-symbols-outlined text-5xl text-lavender-300 mb-6">bubble_chart</span>
          <h4 className="text-2xl font-bold mb-4">无限气泡</h4>
          <p className="text-slate-500 font-medium">每个点子都是一个漂浮的气泡，在这里它们永远不会破碎。</p>
        </div>
        <div className="bg-mint-50/80 p-10 rounded-[3rem] transform translate-y-8 hover:rotate-2 transition-transform border-2 border-mint-100">
          <span className="material-symbols-outlined text-5xl text-mint-200 mb-6">psychology_alt</span>
          <h4 className="text-2xl font-bold mb-4">灵魂共鸣</h4>
          <p className="text-slate-500 font-medium">寻找与你频率相同的造梦者，让协作像云朵般轻盈。</p>
        </div>
        <div className="bg-coral-50/80 p-10 rounded-[3rem] transform hover:-rotate-1 transition-transform border-2 border-coral-100/30">
          <span className="material-symbols-outlined text-5xl text-coral-400 mb-6">rocket_launch</span>
          <h4 className="text-2xl font-bold mb-4">奇迹升空</h4>
          <p className="text-slate-500 font-medium">从草图到成品，我们提供最温柔的助推力。</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
