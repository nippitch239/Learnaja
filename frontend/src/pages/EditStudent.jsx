import { Link } from "react-router-dom";

function EditStudent() {
    return (
        <>
            <div class="bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-300">
                <main class="pt-28 pb-12 max-w-7xl mx-auto px-4 lg:px-6">
                    <div class="flex flex-col lg:flex-row gap-8">
                        <aside class="w-full lg:w-64 shrink-0">
                            <div class="bg-white dark:bg-surface-dark  rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 sticky top-28">
                                <nav class="space-y-1">
                                    <Link to="/editInfo"
                                        class="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                                        >
                                        <span
                                            class="material-symbols-outlined">info</span>
                                        <span>ข้อมูลทั่วไป</span>
                                    </Link>
                                    <Link to="/editCurriculum"
                                        class="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                                        >
                                        <span
                                            class="material-symbols-outlined">menu_book</span>
                                        <span>จัดการคอร์สเรียน</span>
                                    </Link>
                                    <Link to="/editStudent"
                                        class="flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-semibold transition-colors"
                                        >
                                        <span
                                            class="material-symbols-outlined">group</span>
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
                            <div
                                class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                                <div
                                    class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <div>
                                        <h1 class="text-2xl font-bold">จัดการนักเรียน</h1>
                                        <p class="text-slate-400 text-sm">จัดการการลงทะเบียนและเชิญนักเรียนใหม่เข้าสู่คลาสของคุณ</p>
                                    </div>
                                    <button
                                        class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-pink-200 dark:shadow-none flex items-center gap-2">
                                        <span
                                            class="material-symbols-outlined text-xl">person_add</span>
                                        เชิญนักเรียนใหม่
                                    </button>
                                </div>
                                <div class="p-8 space-y-8">
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div
                                            class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                                            <div
                                                class="flex items-center gap-2 text-primary">
                                                <span
                                                    class="material-symbols-outlined">link</span>
                                                <h3 class="font-bold">เชิญด้วยลิงก์</h3>
                                            </div>
                                            <div class="flex gap-2">
                                                <input
                                                    class="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-500"
                                                    readonly type="text"
                                                    value="https://learnnaja.com/join/react-2024" />
                                                <button
                                                    class="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-primary">
                                                    <span
                                                        class="material-symbols-outlined text-xl">content_copy</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div
                                            class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                                            <div
                                                class="flex items-center gap-2 text-primary">
                                                <span
                                                    class="material-symbols-outlined">pin</span>
                                                <h3 class="font-bold">รหัสเข้าคลาส</h3>
                                            </div>
                                            <div
                                                class="flex items-center justify-between bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                                                <span
                                                    class="font-mono font-bold text-lg tracking-wider text-slate-700 dark:text-slate-200">LN-2024-X</span>
                                                <button
                                                    class="text-primary hover:underline text-xs font-bold">รีเฟรช</button>
                                            </div>
                                        </div>
                                        <div
                                            class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                                            <div
                                                class="flex items-center gap-2 text-primary">
                                                <span
                                                    class="material-symbols-outlined">qr_code_2</span>
                                                <h3 class="font-bold">เข้าถึงด้วย QR Code</h3>
                                            </div>
                                            <button
                                                class="w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm hover:border-primary transition-all flex items-center justify-center gap-2">
                                                <span
                                                    class="material-symbols-outlined">download</span>
                                                สร้าง QR Code
                                            </button>
                                        </div>
                                    </div>
                                    <div class="space-y-4">
                                        <div class="flex items-center justify-between">
                                            <h3 class="text-lg font-bold">นักเรียนที่ลงทะเบียนแล้ว <span
                                                    class="text-sm font-normal text-slate-400 ml-2">(124
                                                    คน)</span></h3>
                                            <div class="relative w-64">
                                                <span
                                                    class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                                <input
                                                    class="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-full px-10 py-2 text-sm focus:ring-primary focus:border-primary"
                                                    placeholder="ค้นหาชื่อนักเรียน..."
                                                    type="text" />
                                            </div>
                                        </div>
                                        <div class="overflow-x-auto">
                                            <table
                                                class="w-full text-left border-collapse">
                                                <thead>
                                                    <tr
                                                        class="border-b border-slate-100 dark:border-slate-800">
                                                        <th
                                                            class="py-4 px-4 font-bold text-slate-400 text-sm uppercase tracking-wider">ชื่อนักเรียน</th>
                                                        <th
                                                            class="py-4 px-4 font-bold text-slate-400 text-sm uppercase tracking-wider">วันที่ลงทะเบียน</th>
                                                        <th
                                                            class="py-4 px-4 font-bold text-slate-400 text-sm uppercase tracking-wider">ความคืบหน้า</th>
                                                        <th
                                                            class="py-4 px-4 font-bold text-slate-400 text-sm uppercase tracking-wider text-right">การจัดการ</th>
                                                    </tr>
                                                </thead>
                                                <tbody
                                                    class="divide-y divide-slate-50 dark:divide-slate-800/50">
                                                    <tr
                                                        class="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                                        <td class="py-4 px-4">
                                                            <div
                                                                class="flex items-center space-x-3">
                                                                <div
                                                                    class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-primary font-bold">JD</div>
                                                                <div>
                                                                    <p
                                                                        class="font-bold">Jane
                                                                        Doe</p>
                                                                    <p
                                                                        class="text-xs text-slate-400">jane.doe@example.com</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            class="py-4 px-4 text-slate-500 text-sm">Oct
                                                            12, 2024</td>
                                                        <td class="py-4 px-4">
                                                            <div
                                                                class="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                                <div
                                                                    class="bg-primary h-full w-[85%]"></div>
                                                            </div>
                                                            <span
                                                                class="text-[10px] font-bold text-slate-400">85%
                                                                Complete</span>
                                                        </td>
                                                        <td
                                                            class="py-4 px-4 text-right">
                                                            <button
                                                                class="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                                                <span
                                                                    class="material-symbols-outlined">person_remove</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        class="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                                        <td class="py-4 px-4">
                                                            <div
                                                                class="flex items-center space-x-3">
                                                                <div
                                                                    class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">MS</div>
                                                                <div>
                                                                    <p
                                                                        class="font-bold">Mark
                                                                        Smith</p>
                                                                    <p
                                                                        class="text-xs text-slate-400">mark.s@university.edu</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            class="py-4 px-4 text-slate-500 text-sm">Oct
                                                            15, 2024</td>
                                                        <td class="py-4 px-4">
                                                            <div
                                                                class="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                                <div
                                                                    class="bg-primary h-full w-[32%]"></div>
                                                            </div>
                                                            <span
                                                                class="text-[10px] font-bold text-slate-400">32%
                                                                Complete</span>
                                                        </td>
                                                        <td
                                                            class="py-4 px-4 text-right">
                                                            <button
                                                                class="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                                                <span
                                                                    class="material-symbols-outlined">person_remove</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        class="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                                        <td class="py-4 px-4">
                                                            <div
                                                                class="flex items-center space-x-3">
                                                                <div
                                                                    class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 font-bold">SL</div>
                                                                <div>
                                                                    <p
                                                                        class="font-bold">Sarah
                                                                        Lee</p>
                                                                    <p
                                                                        class="text-xs text-slate-400">sarah_dev@studio.io</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            class="py-4 px-4 text-slate-500 text-sm">Oct
                                                            18, 2024</td>
                                                        <td class="py-4 px-4">
                                                            <div
                                                                class="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                                <div
                                                                    class="bg-primary h-full w-[0%]"></div>
                                                            </div>
                                                            <span
                                                                class="text-[10px] font-bold text-slate-400">Just
                                                                joined</span>
                                                        </td>
                                                        <td
                                                            class="py-4 px-4 text-right">
                                                            <button
                                                                class="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                                                <span
                                                                    class="material-symbols-outlined">person_remove</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div
                                            class="pt-6 flex items-center justify-between text-sm">
                                            <p class="text-slate-400">แสดง 3 จาก 124 คน</p>
                                            <div class="flex items-center space-x-2">
                                                <button
                                                    class="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 disabled:opacity-50"
                                                    disabled>
                                                    <span
                                                        class="material-symbols-outlined">chevron_left</span>
                                                </button>
                                                <button
                                                    class="w-8 h-8 rounded-lg bg-primary text-white font-bold">1</button>
                                                <button
                                                    class="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">2</button>
                                                <button
                                                    class="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">3</button>
                                                <button
                                                    class="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400">
                                                    <span
                                                        class="material-symbols-outlined">chevron_right</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                    <button
                                        class="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        Export List (CSV)
                                    </button>
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
    );
}

export default EditStudent;