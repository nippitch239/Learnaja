import { Link } from "react-router-dom"

function EditCurriculum() {
    return (
        <>
            <div class="bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-300">
                <main class="pt-28 pb-12 max-w-7xl mx-auto px-4 lg:px-6">
                    <div class="flex flex-col lg:flex-row gap-8">
                        <aside class="w-full lg:w-64 shrink-0">
                            <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 sticky top-28">
                                <nav class="space-y-1">
                                    <Link to="/editInfo" class="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors">
                                        <span class="material-symbols-outlined">info</span>
                                        <span>ข้อมูลทั่วไป</span>
                                    </Link>
                                    <Link to="/editCurriculum" class="flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-semibold transition-colors">
                                        <span class="material-symbols-outlined">menu_book</span>
                                        <span>จัดการคอร์สเรียน</span>
                                    </Link>
                                    <Link to="/editStudent" class="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors">
                                        <span class="material-symbols-outlined">group</span>
                                        <span>จัดการนักเรียน</span>
                                    </Link>
                                </nav>
                                <div>
                                    <Link to="/courseTeacher"><button class="bg-primary text-white px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-pink-200 dark:shadow-none mt-6 flex items-center space-x-2 w-full justify-center">
                                        <span class="material-symbols-outlined">arrow_back</span>
                                        <span>กลับไปหน้าคอร์สเรียน</span>
                                    </button></Link>
                                </div>
                            </div>
                        </aside>
                        <div class="flex-1">
                            <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                                <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <div>
                                        <h1 class="text-2xl font-bold">จัดการคอร์สเรียน</h1>
                                        <p class="text-slate-400 text-sm">จัดการบทเรียนและจัดการการมองเห็นของนักเรียน</p>
                                    </div>
                                </div>
                                <div class="p-6 space-y-8">
                                    <div class="space-y-4">
                                        <div
                                            class="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div class="flex items-center space-x-3">
                                                <span
                                                    class="material-symbols-outlined text-slate-400">drag_indicator</span>
                                                <h3 class="font-bold text-lg">บทที่ 1:
                                                    Introduction to React</h3>
                                            </div>
                                            <button
                                                class="text-primary font-bold text-sm hover:underline">แก้ไขบทเรียน</button>
                                        </div>
                                        <div
                                            class="space-y-2 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-6">
                                            <div
                                                class="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
                                                <div
                                                    class="flex items-center space-x-4">
                                                    <span
                                                        class="material-symbols-outlined text-slate-300">play_circle</span>
                                                    <div>
                                                        <p
                                                            class="font-semibold text-slate-700 dark:text-slate-200">1.1
                                                            Welcome to the Course</p>
                                                        <p
                                                            class="text-xs text-slate-400">05:20
                                                            นาที</p>
                                                    </div>
                                                </div>
                                                <div
                                                    class="flex items-center space-x-6">
                                                    <div
                                                        class="flex items-center space-x-2">
                                                        <span
                                                            class="text-xs font-bold text-slate-400 uppercase tracking-wider">การมองเห็น</span>
                                                        <div
                                                            class="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                                            <input checked
                                                                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                                id="toggle1"
                                                                name="toggle"
                                                                type="checkbox" />
                                                            <label
                                                                class="toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer relative"
                                                                for="toggle1"></label>
                                                        </div>
                                                    </div>
                                                    <button
                                                        class="material-symbols-outlined text-slate-300 hover:text-slate-500 transition-colors">more_vert</button>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800 group">
                                                <div
                                                    class="flex items-center space-x-4">
                                                    <span
                                                        class="material-symbols-outlined text-slate-300 opacity-50">play_circle</span>
                                                    <div>
                                                        <div
                                                            class="flex items-center space-x-2">
                                                            <p
                                                                class="font-semibold text-slate-400 dark:text-slate-500">1.2
                                                                History of Web
                                                                Frameworks</p>
                                                            <span
                                                                class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-bold rounded uppercase">ซ่อน</span>
                                                        </div>
                                                        <p
                                                            class="text-xs text-slate-400/60">12:45
                                                            นาที</p>
                                                    </div>
                                                </div>
                                                <div
                                                    class="flex items-center space-x-6">
                                                    <div
                                                        class="flex items-center space-x-2">
                                                        <span
                                                            class="text-xs font-bold text-slate-400 uppercase tracking-wider">การมองเห็น</span>
                                                        <div
                                                            class="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                                            <input
                                                                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                                id="toggle2"
                                                                name="toggle"
                                                                type="checkbox" />
                                                            <label
                                                                class="toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer relative"
                                                                for="toggle2"></label>
                                                        </div>
                                                    </div>
                                                    <button class="material-symbols-outlined text-slate-300 hover:text-slate-500 transition-colors">more_vert</button>
                                                </div>
                                            </div>
                                            <div
                                                class="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
                                                <div
                                                    class="flex items-center space-x-4">
                                                    <span
                                                        class="material-symbols-outlined text-slate-300">play_circle</span>
                                                    <div>
                                                        <p
                                                            class="font-semibold text-slate-700 dark:text-slate-200">1.3
                                                            Setting up Your
                                                            Environment</p>
                                                        <p
                                                            class="text-xs text-slate-400">08:15
                                                            นาที</p>
                                                    </div>
                                                </div>
                                                <div
                                                    class="flex items-center space-x-6">
                                                    <div
                                                        class="flex items-center space-x-2">
                                                        <span
                                                            class="text-xs font-bold text-slate-400 uppercase tracking-wider">การมองเห็น</span>
                                                        <div
                                                            class="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                                            <input checked
                                                                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                                id="toggle3"
                                                                name="toggle"
                                                                type="checkbox" />
                                                            <label
                                                                class="toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer relative"
                                                                for="toggle3"></label>
                                                        </div>
                                                    </div>
                                                    <button
                                                        class="material-symbols-outlined text-slate-300 hover:text-slate-500 transition-colors">more_vert</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="space-y-4">
                                        <div
                                            class="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div class="flex items-center space-x-3">
                                                <span
                                                    class="material-symbols-outlined text-slate-400">drag_indicator</span>
                                                <h3 class="font-bold text-lg">บทที่ 2:
                                                    Core React Concepts</h3>
                                            </div>
                                            <button
                                                class="text-primary font-bold text-sm hover:underline">แก้ไขบทเรียน</button>
                                        </div>
                                        <div
                                            class="space-y-2 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-6">
                                            <div
                                                class="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
                                                <div
                                                    class="flex items-center space-x-4">
                                                    <span
                                                        class="material-symbols-outlined text-slate-300">play_circle</span>
                                                    <div>
                                                        <p
                                                            class="font-semibold text-slate-700 dark:text-slate-200">2.1
                                                            JSX Explained</p>
                                                        <p
                                                            class="text-xs text-slate-400">15:50
                                                            นาที</p>
                                                    </div>
                                                </div>
                                                <div
                                                    class="flex items-center space-x-6">
                                                    <div
                                                        class="flex items-center space-x-2">
                                                        <span
                                                            class="text-xs font-bold text-slate-400 uppercase tracking-wider">การมองเห็น</span>
                                                        <div
                                                            class="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                                            <input checked
                                                                class="toggle-checkbox  absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                                id="toggle4"
                                                                name="toggle"
                                                                type="checkbox" />
                                                            <label
                                                                class="toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer relative"
                                                                for="toggle4"></label>
                                                        </div>
                                                    </div>
                                                    <button
                                                        class="material-symbols-outlined text-slate-300 hover:text-slate-500 transition-colors">more_vert</button>
                                                </div>
                                            </div>
                                            <div
                                                class="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800 group">
                                                <div
                                                    class="flex items-center space-x-4">
                                                    <span
                                                        class="material-symbols-outlined text-slate-300 opacity-50">play_circle</span>
                                                    <div>
                                                        <div
                                                            class="flex items-center space-x-2">
                                                            <p
                                                                class="font-semibold text-slate-400 dark:text-slate-500">2.2
                                                                Advanced Prop Drilling
                                                                (Legacy)</p>
                                                            <span
                                                                class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-bold rounded uppercase">ซ่อน</span>
                                                        </div>
                                                        <p
                                                            class="text-xs text-slate-400/60">22:10
                                                            นาที</p>
                                                    </div>
                                                </div>
                                                <div
                                                    class="flex items-center space-x-6">
                                                    <div
                                                        class="flex items-center space-x-2">
                                                        <span
                                                            class="text-xs font-bold text-slate-400 uppercase tracking-wider">การมองเห็น</span>
                                                        <div
                                                            class="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                                            <input
                                                                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                                id="toggle5"
                                                                name="toggle"
                                                                type="checkbox" />
                                                            <label
                                                                class="toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer relative"
                                                                for="toggle5"></label>
                                                        </div>
                                                    </div>
                                                    <button
                                                        class="material-symbols-outlined text-slate-300 hover:text-slate-500 transition-colors">more_vert</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        class="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center space-x-2">
                                        <span
                                            class="material-symbols-outlined">add_circle</span>
                                        <span>เพิ่มบทเรียน</span>
                                    </button>
                                </div>
                                <div
                                    class="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                    <button
                                        class="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-pink-200 dark:shadow-none">
                                        บันทึกการเปลี่ยนแปลง
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default EditCurriculum