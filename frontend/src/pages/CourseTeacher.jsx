function CourseTeacher() {
    return (
        <div className="  bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 bg-main">
            <div className="bg-pink-50 pt-24 pb-12 hero-pattern dark:hero-pattern border-b border-pink-100 dark:border-slate-800 ">
            <div className="max-w-7xl mx-auto px-6">
                <div className="space-y-8">
                    <div
                        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="max-w-3xl space-y-4">
                            <h1
                                className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                Master React.js &amp; Modern Web Standards 2024
                            </h1>
                            <p
                                className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                ที่สุดของคอร์สเรียน React บน LearnNaja สร้างแอปพลิเคชันที่แข็งแกร่งด้วย Hooks, Redux Toolkit และแนวทางปฏิบัติที่ดีที่สุดในอุตสาหกรรม
                            </p>
                        </div>
                        <div
                            className="flex flex-col items-start lg:items-end gap-4 min-w-[320px]">
                            <div className="flex items-baseline space-x-2">
                                <span
                                    className="text-4xl font-black text-primary">0P</span>
                            </div>
                            <div className="flex gap-3 w-full">
                                <button
                                    className="flex-1 bg-primary text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 dark:shadow-none hover:-translate-y-0.5 transition-all">
                                    Enroll Now
                                </button>
                                <a
                                    className="flex items-center justify-center space-x-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity border-2 border-transparent"
                                    href="#manage-lessons">
                                    <span
                                        className="material-symbols-outlined">settings</span>
                                    <span>แก้ไขคอร์ส</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 bg-white/50 dark:from-slate-800 dark:to-slate-900 backdrop-blur rounded-3xl border border-white dark:border-slate-700">
                        <div className="flex items-center space-x-3">
                            <span
                                className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">schedule</span>
                            <div>
                                <p
                                    className="text-[10px] uppercase tracking-wider font-bold text-slate-400">ใช้เวลา</p>
                                <p className="font-bold text-sm">24.5 ชั่วโมง</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span
                                className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">bar_chart</span>
                            <div>
                                <p
                                    className="text-[10px] uppercase tracking-wider font-bold text-slate-400">ระดับ</p>
                                <p className="font-bold text-sm">ระดับกลาง</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span
                                className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">language</span>
                            <div>
                                <p
                                    className="text-[10px] uppercase tracking-wider font-bold text-slate-400">ภาษา</p>
                                <p className="font-bold text-sm">ไทย</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span
                                className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">grade</span>
                            <div>
                                <p
                                    className="text-[10px] uppercase tracking-wider font-bold text-slate-400">คะแนน</p>
                                <p className="font-bold text-sm">4.9 <span
                                        className="text-slate-400 font-medium">(12k+)</span></p>
                            </div>
                        </div>
                        <div
                            className="hidden lg:flex items-center space-x-3 border-l border-pink-100 dark:border-slate-700 pl-6">
                            <span
                                className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">visibility</span>
                            <div>
                                <p
                                    className="text-[10px] uppercase tracking-wider font-bold text-slate-400">สถานะ</p>
                                <p className="font-bold text-sm">เผยแพร่แล้ว</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <main className="max-w-7xl mx-auto px-6 py-12">
            <div className="space-y-8">
                <section id="course-content">
                    <div className="flex items-center mb-8">
                        <h3 className="text-3xl font-bold">รายละเอียดหลักสูตร</h3>
                    </div>
                    <div
                        className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                        <div
                            className="divide-y divide-slate-100 dark:divide-slate-800">
                            <div
                                className="group flex items-center justify-between p-6 hover:bg-pink-50/30 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                        <span
                                            className="material-symbols-outlined text-green-500 fill-1">check_circle</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span
                                            className="text-lg font-bold group-hover:text-primary transition-colors">Lesson
                                            1: Introduction to React &amp;
                                            Modern Web Ecosystem</span>
                                        <div
                                            className="flex items-center space-x-3 mt-1">
                                            <span
                                                className="flex items-center text-sm text-slate-400">
                                                <span
                                                    className="material-symbols-outlined text-sm mr-1">play_circle</span>
                                                Video • 12:45
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </div>
                            <div
                                className="group flex items-center justify-between p-6 hover:bg-pink-50/30 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                                        <span
                                            className="material-symbols-outlined text-primary">play_circle</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span
                                            className="text-lg font-bold group-hover:text-primary transition-colors">Lesson
                                            2: Understanding JSX and the Virtual
                                            DOM</span>
                                        <div
                                            className="flex items-center space-x-3 mt-1">
                                            <span
                                                className="flex items-center text-sm text-slate-400">
                                                <span
                                                    className="material-symbols-outlined text-sm mr-1">play_circle</span>
                                                Video • 15:00
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </div>
                            <div
                                className="group flex items-center justify-between p-6 hover:bg-pink-50/30 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                                        <span
                                            className="material-symbols-outlined text-primary">play_circle</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span
                                            className="text-lg font-bold group-hover:text-primary transition-colors">Lesson
                                            3: Props vs State: The Core
                                            Mechanics</span>
                                        <div
                                            className="flex items-center space-x-3 mt-1">
                                            <span
                                                className="flex items-center text-sm text-slate-400">
                                                <span
                                                    className="material-symbols-outlined text-sm mr-1">play_circle</span>
                                                Video • 18:20
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </div>
                            <div
                                className   ="group flex items-center justify-between p-6 hover:bg-pink-50/30 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                                        <span
                                            className="material-symbols-outlined text-primary">quiz</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span
                                            className   ="text-lg font-bold group-hover:text-primary transition-colors">Lesson
                                            4: Coding Exercise: Your First
                                            Component</span>
                                        <div
                                            className="flex items-center space-x-3 mt-1">
                                            <span
                                                className="flex items-center text-sm text-slate-400">
                                                <span
                                                    className="material-symbols-outlined text-sm mr-1">edit_note</span>
                                                Practice • 30:00
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </div>
                            <div
                                className   ="group flex items-center justify-between p-6 hover:bg-pink-50/30 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                                        <span
                                            className="material-symbols-outlined text-primary">play_circle</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span
                                            className="text-lg font-bold group-hover:text-primary transition-colors">Lesson
                                            5: Hooks Deep Dive: useEffect &amp;
                                            useState</span>
                                        <div
                                            className="flex items-center space-x-3 mt-1">
                                            <span
                                                className="flex items-center text-sm text-slate-400">
                                                <span
                                                    className="material-symbols-outlined text-sm mr-1">play_circle</span>
                                                Video • 25:15
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </div>
                            <div
                                className="group flex items-center justify-between p-6 hover:bg-pink-50/30 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                                        <span
                                            className="material-symbols-outlined text-primary">play_circle</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span
                                            className="text-lg font-bold group-hover:text-primary transition-colors">Lesson
                                            6: Styling Components with Tailwind
                                            CSS</span>
                                        <div
                                            className="flex items-center space-x-3 mt-1">
                                            <span
                                                className="flex items-center text-sm text-slate-400">
                                                <span
                                                    className="material-symbols-outlined text-sm mr-1">play_circle</span>
                                                Video • 20:00
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </div>
                        </div>
                    </div>
                </section>
                
            </div>
        </main>
        </div>
    );


}
export default CourseTeacher;