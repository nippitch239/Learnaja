import { Link } from "react-router-dom";

function EditInfo() {
    return (
        <>
        <div class="bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <main class="pt-28 pb-12 max-w-7xl mx-auto px-4 lg:px-6">
            <div class="flex flex-col lg:flex-row gap-8">
                <aside class="w-full lg:w-64 shrink-0">
                    <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 sticky top-28">
                        <nav class="space-y-1">
                            <Link to="/editInfo"
                                class="flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-semibold transition-colors"
                                href="Edit_info.html">
                                <span
                                    class="material-symbols-outlined">info</span>
                                <span>ข้อมูลทั่วไป</span>
                            </Link>
                            <Link to="/editCurriculum"
                                class="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                                href="Edit_Cur.html">
                                <span
                                    class="material-symbols-outlined">menu_book</span>
                                <span>จัดการคอร์สเรียน</span>
                            </Link>
                            <Link to="/editStudent"
                                class="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                                href="Edit_Student.html">
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
                                <h1 class="text-2xl font-bold">จัดการรายละเอียดคอร์สเรียน</h1>
                                <p class="text-slate-400 text-sm">จัดการรายละเอียด ชื่อคอร์สเรียน และภาพหน้าปกของคอร์สเรียน</p>
                            </div>
                        </div>
                        <div class="p-8 space-y-8">
                            <div class="space-y-2">
                                <label
                                    class="block text-sm font-bold text-slate-700 dark:text-slate-300">ชื่อคอร์สเรียน</label>
                                <input
                                    class="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="Enter course title..."
                                    type="text"
                                    value="Master React.js &amp; Modern Web Standards 2024" />
                            </div>
                            <div class="space-y-2">
                                <label
                                    class="block text-sm font-bold text-slate-700 dark:text-slate-300">รายละเอียดคอร์สเรียน</label>
                                <textarea
                                    class="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="Write a compelling description for your course..."
                                    rows="6">นี่คือคอร์สเรียนที่ครอบคลุมทุกหัวข้อพื้นฐานของ React ไปจนถึงรูปแบบขั้นสูง คุณจะเรียนรู้ hooks, context API และวิธีการสร้างแอปพลิเคชันที่สามารถขยายได้โดยใช้มาตรฐานเว็บสมัยใหม่</textarea>
                            </div>
                            <div class="space-y-2">
                                <label
                                    class="block text-sm font-bold text-slate-700 dark:text-slate-300">ภาพหน้าปกคอร์สเรียน</label>
                                <div class="flex items-start space-x-6">
                                    <div
                                        class="w-48 h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                                        <img alt="Thumbnail"
                                            class="w-full h-full object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5k3oDnPNE0cNDaQeMrmbImR8VvlDhRRoX06smqaeAa6T4aIjY881l5p9shU9yoE3TF-45Fcqb0C-9ebJqIVEe3knAJc22d4XCtkr4cNLnWpAWQqolxqYl_8MhBX0_lyEdx515Nc1cKYvBfepc4TWQXMo_CsIYhW0ilBmgcjdAUQtoG65dN_3WVzHiLHJ0G58YiH_KKdcs3uydCTIjyjOKDbtL8F7x4Xhx5NERh28woYFfI1pALMbZwIZdQNZeSuKC_vsHLdLP9dg" />
                                    </div>
                                    <div class="flex-1">
                                        <div
                                            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-xl hover:border-primary transition-colors cursor-pointer group">
                                            <div class="space-y-1 text-center">
                                                <span
                                                    class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-3xl">cloud_upload</span>
                                                <div
                                                    class="flex text-sm text-slate-600 dark:text-slate-400">
                                                    <label
                                                        class="relative cursor-pointer rounded-md font-bold text-primary hover:text-pink-400 focus-within:outline-none">
                                                        <span>เพิ่มไฟล์</span>
                                                        <input class="sr-only"
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file" />
                                                    </label>
                                                    <p class="pl-1">หรือลากไฟล์มาวาง</p>
                                                </div>
                                                <p
                                                    class="text-xs text-slate-400">PNG,
                                                    JPG, GIF up to 10MB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

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

export default EditInfo