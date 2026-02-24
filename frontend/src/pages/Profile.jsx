import { Link } from "react-router-dom";

function Profile() {
    return (
        <>
            <div className="font-sans bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen">
            <main className="pt-24 max-w-7xl mx-auto px-4 py-8 bg-pattern min-h-screen">
            <section className="mb-12 ">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 shadow-sm bg-linear-to-br from-primary/10 to-accent-purple/20 dark:from-primary/5 dark:to-slate-800 ">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                            <img alt="User Large Avatar"
                                className="w-full h-full object-cover"
                                src="/images/user.png" />
                        </div>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold mb-1">Bubu Bubabubu</h1>
                        <p
                            className="text-slate-500 dark:text-slate-400 font-medium text-sm">นักเรียน</p>
                        <div
                            className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                            <div className="flex flex-col">
                                <span
                                    className="text-xl font-bold text-primary">1000P</span>
                                <span
                                    className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">คะแนนทั้งหมด</span>
                            </div>
                            <div
                                className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                            <div className="flex flex-col">
                                <span
                                    className="text-xl font-bold text-slate-700 dark:text-slate-200">12</span>
                                <span
                                    className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">เรียนจบแล้ว</span>
                            </div>
                            <div
                                className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                            <div className="flex flex-col">
                                <span
                                    className="text-xl font-bold text-slate-700 dark:text-slate-200">4</span>
                                <span
                                    className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">กำลังเรียน</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/edit-profile">
                        <button
                            className="px-5 py-2 bg-primary/10 text-primary font-bold text-sm rounded-full hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                            <span
                                className="material-symbols-outlined text-sm">edit</span>
                            แก้ไขโปรไฟล์
                        </button>
                        </Link>
                    </div>
                </div>
            </section>
            <section className="mb-12">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2
                            className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">กำลังเรียนอยู่</h2>
                    </div>
                    <a
                        className="dark:bg-primary/10 dark:border-primary/20 hover:bg-primary/20  text-sm font-bold text-primary  flex items-center gap-1 bg-white/50 px-4 py-2 rounded-full border border-slate-100"
                        href="#">
                        ดูทั้งหมด<span
                            className="material-symbols-outlined text-xs">arrow_forward</span>
                    </a>
                </div>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 ">
                    <div
                        className="bg-white/50 dark:bg-slate-800 bg-card-light dark:bg-card-dark p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div
                            className="aspect-16/10 w-full rounded-lg bg-slate-100 dark:bg-slate-800 mb-5 overflow-hidden relative">
                            <img alt="UI Design Course"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ8kjuIv3nvMxQhaLnXdFKPfMIQIwZqlhgasic7C-_5xbq7_1YikUlLvAZaOwDqq9-b3kQCx6CrNXD9J-T6EFnEQMxvxBTJ6KhMr0rNlnMr18zoCFviKZb32wAEc19yiIBPcdsCxcVGG3g4RxpuGEAZyVLsnpRCXpsXuGCc_bclhc0vmw_IUolDuPfg3UJeoieyhHb6v68dCNH0o5jJDLBwIxMlG1N4foPfg7etG14rNm14Zi8CoMdF2KsH7TuopljD2TQjIMrR_0" />
                            <div
                                className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-60"></div>
                            <div
                                className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-primary shadow-sm">
                                75% COMPLETE
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3
                                className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-1">Advanced
                                UI Design Principles</h3>
                            <p
                                className="text-sm text-slate-500 mb-4 line-clamp-2">Master
                                the art of creating intuitive and beautiful
                                digital interfaces with modern tools.</p>
                            <div
                                className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full w-[75%]"></div>
                            </div>
                        </div>
                        <div
                            className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-primary/20 overflow-hidden">
                                    <img alt="Instructor"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAak-COAVttK5mJL2BF8hRfO0rb5hHcxaD4l-Fvht03oKg53SXxKBlmg24sacJtWlC7nVg1D7J7zKAhFUGqUSnW2RIIgZJ90kWFuXo5Se9xxzgH5-na8WfSGqomZ_razhBhY51NDHAk71xiA1kV30xacYxr6ccXuvX_kBgBShWQuh9Hyh3G7qhVwjfMCjHJHngmHYz8a4jzwD3a_SMF8O3TfYIH5bC29Yr2neomhEj_6-HjiXoyQNgPta9GQ4ARQT5rpUGutQZm6p8" />
                                </div>
                                <div className="flex flex-col">
                                    <span
                                        className="text-xs font-bold text-slate-700 dark:text-slate-300">Sarah
                                        Jenkins</span>
                                    <span
                                        className="text-[10px] text-slate-400">Lead
                                        Designer</span>
                                </div>
                            </div>
                            <button
                                className="bg-primary text-white w-10 h-10 flex items-center justify-center hover:opacity-90 dark:shadow-slate-900 rounded-full transition-all shadow-md shadow-pink-200">
                                <span
                                    className="material-symbols-outlined">play_arrow</span>
                            </button>
                        </div>
                    </div>
                    
                </div>
            </section>
        </main>
        </div>
        </>
)};

export default Profile;