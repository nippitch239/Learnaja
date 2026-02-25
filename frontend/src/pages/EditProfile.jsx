

function EditProfile() {
    return (
        <>
            <div className="font-sans bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen">
                <div className="pt-24 max-w-7xl mx-auto px-4 py-8 bg-pattern min-h-screen">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <aside className="lg:col-span-1 space-y-6">
                            <div className="bg-white/50 dark:bg-slate-900/70  p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
                                <div className="relative inline-block mb-4">
                                    <img alt="User Avatar"
                                        className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20"
                                        src="/images/user.png" />
                                    <button className="py-1 absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                                        <span
                                            className="material-symbols-outlined text-base">photo_camera</span>
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold">username</h2>
                                <p
                                    className="text-slate-500 dark:text-slate-400 text-sm">babubabu@gmail.com</p>
                            </div>
                            <div
                                className="bg-white/50 dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-primary">stars</span>
                                        คะแนนสะสม
                                    </h3>
                                    <span className="text-primary font-bold text-lg">1,000
                                        P</span>
                                </div>
                                <div className="space-y-4">
                                    <div
                                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="bg-green-100 dark:bg-green-900/30 text-green-600 p-2 rounded-lg">
                                                <span
                                                    className="material-symbols-outlined text-sm">quiz</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">Thai
                                                    History Quiz</p>
                                                <p className="text-xs text-slate-400">Oct
                                                    24, 2023</p>
                                            </div>
                                        </div>
                                        <span
                                            className="text-green-500 font-bold text-sm">+200</span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="bg-green-100 dark:bg-green-900/30 text-green-600 p-2 rounded-lg">
                                                <span
                                                    className="material-symbols-outlined text-sm">auto_stories</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">Daily
                                                    Attendance</p>
                                                <p className="text-xs text-slate-400">Oct
                                                    23, 2023</p>
                                            </div>
                                        </div>
                                        <span
                                            className="text-green-500 font-bold text-sm">+50</span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 p-2 rounded-lg">
                                                <span
                                                    className="material-symbols-outlined text-sm">shopping_bag</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">Badge
                                                    Redemption</p>
                                                <p className="text-xs text-slate-400">Oct
                                                    20, 2023</p>
                                            </div>
                                        </div>
                                        <span
                                            className="text-blue-500 font-bold text-sm">-100</span>
                                    </div>
                                </div>
                                <button
                                    className="w-full mt-6 text-primary text-sm font-semibold hover:underline">View
                                    All Activities</button>
                            </div>
                        </aside>
                        <section className="lg:col-span-2">
                            <div
                                className="bg-white/50 dark:bg-slate-900/70 dark:bg-card-dark p-8 md:p-10 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="mb-10">
                                    <h1 className="text-2xl font-bold mb-2">ตั้งค่าบัญชีผู้ใช้</h1>
                                    <p className="text-slate-500 dark:text-slate-400">อัปเดตข้อมูลโปรไฟล์และตั้งค่าความปลอดภัยของคุณ</p>
                                </div>
                                <form className="space-y-10">
                                    <div>
                                        <h3
                                            className="text-lg font-semibold mb-6 flex items-center gap-2">
                                            <span
                                                className="material-symbols-outlined text-primary">person</span>
                                            ข้อมูลส่วนตัว
                                        </h3>
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label
                                                    className="text-sm font-medium text-slate-600 dark:text-slate-300">ชื่อจริงและนามสกุล</label>
                                                <input
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                                    type="text" placeholder="กรอกชื่อจริงและนามสกุล"
                                                     />
                                            </div>
                                            <div className="space-y-2">
                                                <label
                                                    className="text-sm font-medium text-slate-600 dark:text-slate-300">ที่อยู่อีเมล</label>
                                                <input
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/50"
                                                    disabled type="email" placeholder="กรอกที่อยู่อีเมล"
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                    <hr
                                        className="border-slate-100 dark:border-slate-800" />
                                    <div>
                                        <h3
                                            className="text-lg font-semibold mb-6 flex items-center gap-2">
                                            <span
                                                className="material-symbols-outlined text-primary">lock</span>
                                            ความปลอดภัยของบัญชี
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6 max-w-lg">
                                            <div className="space-y-2">
                                                <label
                                                    className="text-sm font-medium text-slate-600 dark:text-slate-300">รหัสผ่านปัจจุบัน</label>
                                                <input
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                                    placeholder="กรอกรหัสผ่านปัจจุบัน"
                                                    type="password" />
                                            </div>
                                            <div
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label
                                                        className="text-sm font-medium text-slate-600 dark:text-slate-300">รหัสผ่านใหม่</label>
                                                    <input
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                                        placeholder="กรอกรหัสผ่านใหม่"
                                                        type="password" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label
                                                        className="text-sm font-medium text-slate-600 dark:text-slate-300">ยืนยันรหัสผ่านใหม่</label>
                                                    <input
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                                        placeholder="ยืนยันรหัสผ่านใหม่"
                                                        type="password" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
                                        <button
                                            className="text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors"
                                            type="button">ลบบัญชีผู้ใช้</button>
                                        <div
                                            className="flex items-center gap-4 w-full md:w-auto">
                                            <button
                                                className="w-full md:w-auto px-8 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                                type="reset">ยกเลิก</button>
                                            <button
                                                className="w-full md:w-auto px-10 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:brightness-105 active:scale-[0.98] transition-all"
                                                type="submit">บันทึกการเปลี่ยนแปลง</button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProfile;