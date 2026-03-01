import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


function Guest() {

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = () => {
        login();
        navigate("/home");
    };

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
                        <div className="hidden md:flex flex-1 max-w-xl mx-8">
                            <div className="relative w-full">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#fb90a9]">search</span>
                                <input className="w-full bg-white/20 border-none rounded-full py-2 pl-12 pr-4 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 transition-all" placeholder="ค้นหาคอร์สเรียน..." type="text" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-white font-semibold text-sm hover:opacity-80 transition"
                                 onClick={handleLogin}>Log In</button>
                            <button onClick={() => navigate("/register")} className="bg-white text-primary px-6 py-2 rounded-full font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
                               >Sign Up</button>
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
                            className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold font-sans rounded-2xl hover:shadow-xl hover:shadow-primary/30 transition-all text-lg tracking-wide" onClick={handleLogin}>
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
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2
                            className="text-3xl font-bold text-slate-900 dark:text-white">
                            คอร์สที่นิยม</h2>
                        <p
                            className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            เข้าถึงคอร์สที่ได้รับความนิยมสูงสุดจากผู้เรียนของเรา</p>
                    </div>
                    <a
                        className="text-primary font-bold hover:underline flex items-center group"
                        href="#">
                        ดูทั้งหมด <span
                            className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div
                        className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                        <div
                            className="h-48 bg-accent-blue relative overflow-hidden">
                            <img alt="Web Development"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH1CR8Eq5DZ9bxjcYHrnK8UpB46himDXNwK7wU6EVTSAc8MXujUrbPhmKZvA8smmZCOpreo-VrpHOAFXQRuiffgW3lAEfghhejTxcQEp_vjuAY6PQbpk1P8XHlJLkWXBjnBT-2Oy_z43w6LQYUKPLJxpYhIqc3xWPX9i73fCeLW-Kd0VO1UHDdQJMmnpyv36cfFsuY4tEjVMg_d3PSzJVgVUYv3dmJQns6mAaQ-_8jhhPSJLuVFJe2soWd4J3twfg1NjT-ia5HZLU" />
                        </div>
                        <div className="p-5">
                            <p
                                className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Development</p>
                            <h3
                                className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-2">Mastering
                                Full-Stack Web Dev with Tailwind</h3>
                            <div className="flex items-center space-x-1 mb-4">
                                <span
                                    className="material-symbols-outlined text-yellow-400 text-[18px] fill-[1]">star</span>
                                <span
                                    className="text-sm font-bold dark:text-slate-300">4.9</span>
                                <span className="text-sm text-slate-400">(1,200
                                    รีวิว)</span>
                            </div>
                            <div
                                className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                                <span
                                    className="font-bold text-slate-900 dark:text-white">100P</span>
                                <button
                                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition">Enroll</button>
                            </div>
                        </div>
                    </div>
                    <div
                        className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                        <div
                            className="h-48 bg-accent-purple relative overflow-hidden">
                            <img alt="UI Design"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkE4695f4jNw7wYvTslPcomIcEOPbGAwR4MY7DkKkveVasvo0DhSo648aqN76Xs1XNf5G0I-SRux4aG-_FNUTNHsQUIRdvl_a5itpxmYT0aZ8kBOn49DoVXQk4lQsX1xnK4L_DSvsq0Ng7ugqIvYbUZUS7_71vOktB7lAvg4s542MriQpRSoaaJwcI2uoHdvBlExVHr-55w2e3V9LIt82V34LOIQwkOePeC3NCQvcC2ZlzVL73K_gqbI3Qce4FwP_vBt9eh3Np6sM" />
                        </div>
                        <div className="p-5">
                            <p
                                className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2">Design</p>
                            <h3
                                className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-2">UI
                                Design Fundamentals &amp; Color Theory</h3>
                            <div className="flex items-center space-x-1 mb-4">
                                <span
                                    className="material-symbols-outlined text-yellow-400 text-[18px] fill-[1]">star</span>
                                <span
                                    className="text-sm font-bold dark:text-slate-300">4.8</span>
                                <span className="text-sm text-slate-400">(850
                                    รีวิว)</span>
                            </div>
                            <div
                                className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                                <span
                                    className="font-bold text-slate-900 dark:text-white">100P</span>
                                <button
                                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition">Enroll</button>
                            </div>
                        </div>
                    </div>
                    <div
                        className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                        <div
                            className="h-48 bg-accent-green relative overflow-hidden">
                            <img alt="Data Science"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWkd3DsYCwjvEe3Lz4w8MKnqeuVcBFTk3hniG-aFURj_7P6lsvuCVoP-jB4gQQ2BAO7fEXOPjKHT9zA-lPuTGaYnlPWpIfhg1lr3EfHKbd2eD-271iDrJo3Z8DS5-dB0E-lyPGCFIZ1z_GAiO7I1Hcr-AS3ICFiK_1LodSILeSyaf9wjltofvK8FsfwMIK1_zbnyFJLK9BqNMAB50lAudYEq3lZ-2z7WuK1P-4mxry5CRTNeJ6vMa6Goj__JTeeWGY0rNQMx7frwQ" />
                        </div>
                        <div className="p-5">
                            <p
                                className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2">Data
                                Science</p>
                            <h3
                                className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-2">Python
                                for Data Analysis &amp; Visualization</h3>
                            <div className="flex items-center space-x-1 mb-4">
                                <span
                                    className="material-symbols-outlined text-yellow-400 text-[18px] fill-[1]">star</span>
                                <span
                                    className="text-sm font-bold dark:text-slate-300">4.7</span>
                                <span className="text-sm text-slate-400">(2,100
                                    รีวิว)</span>
                            </div>
                            <div
                                className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                                <span
                                    className="font-bold text-slate-900 dark:text-white">100P</span>
                                <button
                                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition">Enroll</button>
                            </div>
                        </div>
                    </div>
                    <div
                        className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                        <div
                            className="h-48 bg-primary/20 relative overflow-hidden">
                            <img alt="Business"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn5A3OKsQ7PSRClEdmhWT_NhY2Um1OSGqlOsOTusS7Cdk2rFVfnm-fkuVSlbgs3j77ehDrSDEBiVj8Fk9F-k-xi6TyKW5tb1Bpz3-5BEbtMPqSh217rVn7mn7RjG20wTQDJTa92TWSmV9tR7Gb5U8sep7hJ5WzEXKPjX9TpDTfklrp7DOv1xCvWSMDCqfJyRSvw50sWrtDP8QvSWdtHVhiOlDxYB0zZyuqQhPWPH4jIJyz5ZvQ-KXg6sPwPdCqsLvyOf1H2NTluuU" />
                        </div>
                        <div className="p-5">
                            <p
                                className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Business</p>
                            <h3
                                className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-2">Startup
                                Growth Strategies in 2024</h3>
                            <div className="flex items-center space-x-1 mb-4">
                                <span
                                    className="material-symbols-outlined text-yellow-400 text-[18px] fill-[1]">star</span>
                                <span
                                    className="text-sm font-bold dark:text-slate-300">4.9</span>
                                <span className="text-sm text-slate-400">(540
                                    รีวิว)</span>
                            </div>
                            <div
                                className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                                <span
                                    className="font-bold text-slate-900 dark:text-white">100P</span>
                                <button
                                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition">Enroll</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
            </div>
            
        </>
    );
}

export default Guest;
