
import { useNavigate } from "react-router-dom";



function Guest() {

    const navigate = useNavigate();

    return (
        <>
            <div className="font-sans bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen">
                <nav className="sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div
                        className="bg-primary rounded-2xl shadow-lg px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span><img src="/images/logo_white.png" alt="Learnaja Logo" className="h-8 w-8" /></span>
                            <span className="text-white font-bold text-2xl tracking-tight">Learnaja</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <button className="text-white font-semibold text-sm hover:opacity-80 transition"
                                 onClick={() => navigate("/login")}>เข้าสู่ระบบ</button>
                            <button onClick={() => navigate("/register")} className="bg-white text-primary px-6 py-2 rounded-full font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
                               >สมัครสมาชิก</button>
                        </div>
                    </div>
                </nav>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <section
                className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 to-accent-purple/20 dark:from-primary/5 dark:to-slate-800 p-8 md:p-20 border border-primary/10 text-center mb-16 opacity-0  animate-[slideUp_0.6s_ease-out_forwards]">
                <div className="relative z-10 max-w-3xl mx-auto">
                    <span
                        className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-primary/20 text-primary mb-6 tracking-wide uppercase">
                        Let's learn ヾ(≧▽≦*)o
                    </span>
                    <h1
                        className="text-5xl md:text-6xl font-extrabold font-sans text-slate-900 dark:text-white mb-8 md:leading-tight md:tracking-wide">
                        ปลดล็อคสกิลทองแห่งการเรียนรู้ไปกับ <span className="text-primary">Learnaja</span>
                    </h1>
                    <div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold font-sans rounded-2xl hover:shadow-xl hover:shadow-primary/30 transition-all text-lg tracking-wide" onClick={() => navigate("/login")}>
                            เริ่มเรียนรู้เลย
                        </button>

                    </div>
                </div>
                <div
                    className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
                <div
                    className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-blue/30 rounded-full blur-3xl opacity-50"></div>
            </section>
            <section className="mb-20 opacity-0  animate-[slideUp_0.6s_ease-out_forwards]">
                <div className="text-center mb-12">
                    <h2
                        className="text-3xl font-sans font-bold text-slate-900 dark:text-white mb-4">
                       ทำไมต้องเป็น Learnaja</h2>
                    <p className="text-slate-500 font-sans dark:text-slate-400">
                        แพลตฟอร์มการเรียนรู้ที่ออกแบบเพื่อรองรับอนาคตของการศึกษา</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div
                        className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 text-center hover:shadow-md transition">
                        <div
                            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span
                                className="material-symbols-outlined text-primary text-3xl">school</span>
                        </div>
                        <h3
                            className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Expert
                            Instructors</h3>
                        <p
                            className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            เรียนรู้จากผู้สอนที่มีความรู้และประสบการณ์จริง สามารถถ่ายทอดเนื้อหาและแนวทางปฏิบัติที่นำไปใช้ได้จริง ช่วยให้ผู้เรียนเข้าใจบทเรียนได้อย่างมีประสิทธิภาพ
                        </p>
                    </div>
                    <div
                        className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 text-center hover:shadow-md transition">
                        <div
                            className="w-16 h-16 bg-accent-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span
                                className="material-symbols-outlined text-blue-500 text-3xl">schedule</span>
                        </div>
                        <h3
                            className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Flexible
                            Learning</h3>
                        <p
                            className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            เรียนได้ทุกที่ทุกเวลา ผ่านระบบออนไลน์ที่รองรับหลายอุปกรณ์ ผู้เรียนสามารถเรียนตามจังหวะของตนเอง พร้อมติดตามความก้าวหน้าและผลการเรียนได้ตลอดเวลา
                        </p>
                    </div>
                    <div
                        className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 text-center hover:shadow-md transition">
                        <div
                            className="w-16 h-16 bg-accent-green rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span
                                className="material-symbols-outlined text-green-500 text-3xl">star</span>
                        </div>
                        <h3
                            className="font-bold text-xl mb-3 text-slate-900 dark:text-white">
                            Gamified Learning Experience</h3>
                        <p
                            className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            สะสมคะแนนจากการเรียนและทำแบบทดสอบ เพื่อนำไปแลกซื้อคอร์สหรือสื่อการเรียนรู้เพิ่มเติม ช่วยให้เข้าถึงความรู้ใหม่ ๆ และพัฒนาทักษะได้อย่างต่อเนื่อง
                        </p>
                    </div>
                </div>
            </section>
           
        </main>
            </div>
            
        </>
    );
}

export default Guest;
