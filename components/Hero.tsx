export default function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-12 text-center sm:pb-32 sm:pt-16">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-mint-100 px-4 py-1.5 text-sm font-bold text-emerald-600">
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          auto_awesome
        </span>
        欢迎来到造梦者的集散地
      </div>

      <h1 className="text-balance mb-8 text-5xl font-black sm:text-6xl md:text-8xl">
        <span className="script-title block mb-4">点亮你的</span>
        <span className="bg-gradient-to-r from-lavender-300 via-coral-400 to-mint-200 bg-clip-text text-transparent drop-shadow-sm">
          奇思妙想
        </span>
      </h1>

      <p className="text-pretty mx-auto mb-12 max-w-2xl text-xl font-medium leading-relaxed text-slate-500 md:text-2xl">
        在这里，每一个古怪的念头都能编织成现实。
        <br />
        和志同道合的探索者一起，在梦境中构建奇迹。
      </p>

      <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
        <a
          href="/submit"
          className="group flex items-center gap-3 rounded-full bg-coral-400 px-8 py-4 text-base font-bold text-white shadow-[0_10px_30px_rgba(251,113,133,0.4)] transition-[transform,color] duration-200 hover:scale-105 hover:bg-coral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff] motion-reduce:transform-none motion-reduce:transition-none sm:px-10 sm:py-5 sm:text-xl sm:hover:-rotate-2 sm:hover:scale-110"
        >
          <span className="material-symbols-outlined transition-transform group-hover:rotate-12 motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true">
            temp_preferences_custom
          </span>
          编织梦想
        </a>

        <a
          href="/#tools"
          className="flex items-center gap-3 rounded-full border-2 border-dashed border-mint-300 bg-white/80 px-8 py-4 text-base font-bold text-slate-600 transition-colors duration-200 hover:border-mint-500 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8ff] motion-reduce:transition-none sm:px-10 sm:py-5 sm:text-xl"
        >
          <span className="material-symbols-outlined text-mint-500" aria-hidden="true">
            explore
          </span>
          探索奇迹工坊
        </a>
      </div>

      <div className="absolute -left-10 top-1/4 hidden opacity-20 lg:block" aria-hidden="true">
        <span className="material-symbols-outlined text-[12rem] text-lavender-300">toys_fan</span>
      </div>
      <div className="absolute -right-10 bottom-0 hidden opacity-20 lg:block" aria-hidden="true">
        <span className="material-symbols-outlined text-[15rem] text-mint-200">wind_power</span>
      </div>
    </section>
  );
}
