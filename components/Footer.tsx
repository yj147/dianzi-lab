// import Link from 'next/link'; // Removed unused import to fix lint error

export default function Footer() {
    return (
        <footer className="relative z-10 pt-20 pb-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-lavender-50/50 backdrop-blur-sm rounded-[4rem] p-12 md:p-20 text-slate-700 relative overflow-hidden border border-white/60 shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-mint-100/40 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-coral-100/30 rounded-full blur-3xl -ml-16 -mb-16"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
                        <div className="col-span-1 lg:col-span-2">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-coral-400 text-white rounded-full flex items-center justify-center transform -rotate-12 shadow-lg shadow-coral-200">
                                    <span className="material-symbols-outlined text-2xl">auto_fix_normal</span>
                                </div>
                                <span className="font-script text-4xl text-slate-800">奇迹工坊</span>
                            </div>
                            <p className="text-slate-600 text-lg max-w-sm mb-8 font-medium leading-relaxed">
                                让世界多一点不可思议，<br />
                                让生活充满温柔的惊喜。
                            </p>
                            <div className="flex gap-4">
                                <a className="w-12 h-12 rounded-full bg-white border-2 border-lavender-200 flex items-center justify-center text-lavender-300 hover:bg-coral-400 hover:text-white hover:border-coral-400 transition-all hover:-translate-y-1 shadow-sm" href="#">
                                    <span className="material-symbols-outlined text-xl">flutter_dash</span>
                                </a>
                                <a className="w-12 h-12 rounded-full bg-white border-2 border-lavender-200 flex items-center justify-center text-lavender-300 hover:bg-lavender-300 hover:text-white hover:border-lavender-300 transition-all hover:-translate-y-1 shadow-sm" href="#">
                                    <span className="material-symbols-outlined text-xl">camera</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h5 className="font-bold text-xl mb-8 text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-outlined text-mint-200 text-2xl">explore</span>
                                漫游指南
                            </h5>
                            <ul className="space-y-4 text-slate-600 font-medium">
                                <li>
                                    <a className="hover:text-coral-400 transition-colors flex items-center gap-2 group" href="#">
                                        <span className="material-symbols-outlined text-sm text-lavender-300 group-hover:text-coral-400">arrow_forward_ios</span>
                                        新手秘籍
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-coral-400 transition-colors flex items-center gap-2 group" href="#">
                                        <span className="material-symbols-outlined text-sm text-lavender-300 group-hover:text-coral-400">arrow_forward_ios</span>
                                        灵感泉源
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-coral-400 transition-colors flex items-center gap-2 group" href="#">
                                        <span className="material-symbols-outlined text-sm text-lavender-300 group-hover:text-coral-400">arrow_forward_ios</span>
                                        工坊守则
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-xl mb-8 text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-outlined text-coral-400 text-2xl">outgoing_mail</span>
                                联系我们
                            </h5>
                            <ul className="space-y-4 text-slate-600 font-medium">
                                <li>
                                    <a className="hover:text-coral-400 transition-colors flex items-center gap-2 group" href="#">
                                        <span className="material-symbols-outlined text-lg text-lavender-300 group-hover:text-coral-400 group-hover:scale-110 transition-transform">pets</span>
                                        给猫头鹰写信
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-coral-400 transition-colors flex items-center gap-2 group" href="#">
                                        <span className="material-symbols-outlined text-lg text-lavender-300 group-hover:text-coral-400 group-hover:scale-110 transition-transform">rocket</span>
                                        加入星际群组
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-coral-400 transition-colors flex items-center gap-2 group" href="#">
                                        <span className="material-symbols-outlined text-lg text-lavender-300 group-hover:text-coral-400 group-hover:scale-110 transition-transform">diversity_2</span>
                                        加入我们
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-20 pt-10 border-t border-lavender-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} 奇迹工坊 · 让奇思妙想自由呼吸</p>
                        <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                            用爱与魔法驱动 <span className="material-symbols-outlined text-sm text-coral-400 animate-pulse">favorite</span> StellarLink
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
