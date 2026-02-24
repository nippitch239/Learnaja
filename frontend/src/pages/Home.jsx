import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchCourses } from "../services/fetchCourse";

function Home() {
    const { user } = useContext(AuthContext);
    const [topCourses, setTopCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTopCourses = async () => {
            try {
                const data = await fetchCourses("", "rating", 4);
                setTopCourses(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadTopCourses();
    }, []);

    const scrollToCategory = () => {
        document.getElementById("Catagory").scrollIntoView({
            behavior: "smooth",
        });
    };
    return (
        <>
            <div className=" bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12 space-y-12 tracking-normal">
                    <section
                        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 to-accent-purple/20 dark:from-primary/5 dark:to-slate-800 p-8 md:p-16 border border-primary/10">
                        <div className="relative z-10 max-w-2xl">
                            <span
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary mb-6">
                                ยินดีต้อนรับกลับ, {user?.name}! 👋
                            </span>
                            <h1
                                className="md:leading-tight tracking-wide text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                                อย่าหยุดเรียนรู้ เพื่อ <br /><span
                                    className="text-primary">พัฒนา</span> ในทุกสกิล
                            </h1>
                            <p
                                className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg">
                                ก้าวต่อไปกับหลักสูตรที่คุณชื่นชอบและค้นพบสิ่งใหม่ๆ ที่จะช่วยให้คุณประสบความสำเร็จในเส้นทางการเรียนรู้ของคุณ!
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/courses"><button
                                    className="cursor-pointer px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all">
                                    เริ่มการเรียนรู้
                                </button></Link>
                                <button onClick={scrollToCategory}
                                    className="cursor-pointer px-8 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all">
                                    เลือกหมวดหมู่ที่สนใจ
                                </button>
                            </div>
                        </div>

                    </section>
                    <section id="Catagory" className="pb-24 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white pt-24">หมวดหมู่หลักสูตร</h2>
                        <div className="flex flex-wrap gap-6 mt-6 justify-center">
                            <div className="flex flex-col items-center space-y-2 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6">
                                <span className="material-symbols-outlined text-primary text-3xl">code</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">Programming</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6">
                                <span className="material-symbols-outlined text-primary text-3xl">brush</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">Design</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6">
                                <span className="material-symbols-outlined text-primary text-3xl">bar_chart</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">Data Science</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6">
                                <span className="material-symbols-outlined text-primary text-3xl">network_check</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">Networking</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6">
                                <span className="material-symbols-outlined text-primary text-3xl">security</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">Cybersecurity</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6">
                                <span className="material-symbols-outlined text-primary text-3xl">translate</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">Language</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6">
                                <span className="material-symbols-outlined text-primary text-3xl">business</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">Business</span>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2
                                    className="text-3xl font-bold text-slate-900 dark:text-white">คอร์สแนะนำ</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    เข้าถึงคอร์สที่ได้รับความนิยมสูงสุดจากผู้เรียนของเรา</p>
                            </div>
                            <Link to="/courses"
                                className="text-primary font-bold hover:underline flex items-center group">ดูทั้งหมด <span
                                    className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {loading ? (
                                [1, 2, 3, 4].map(i => (
                                    <div key={i} className="animate-pulse bg-white dark:bg-slate-800 h-80 rounded-2xl border border-slate-100 dark:border-slate-700"></div>
                                ))
                            ) : topCourses.length > 0 ? (
                                topCourses.map(course => (
                                    <div
                                        key={course.id}
                                        onClick={() => navigate(`/courses/${course.id}`)}
                                        className="cursor-pointer group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col"
                                    >
                                        <div className="h-48 bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                                            <img
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                src={course.thumbnail_url || "/images/user.png"}
                                                onError={(e) => { e.target.src = "/images/user.png"; }}
                                            />
                                            {course.category && (
                                                <span className="absolute top-4 left-4 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-[10px] font-bold rounded shadow-sm uppercase tracking-wider">
                                                    {course.category}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">{course.category || "General"}</p>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                {course.title}
                                            </h3>
                                            <div className="flex items-center space-x-1 mb-4 mt-auto">
                                                <span className="material-symbols-outlined text-yellow-400 text-[18px] fill-[1]">star</span>
                                                <span className="text-sm font-bold dark:text-slate-300">{(course.rating || 0).toFixed(1)}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">
                                                    ({course.rating_count > 1000 ? (course.rating_count / 1000).toFixed(1) + 'k' : course.rating_count || 0} รีวิว)
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                                                <span className="font-black text-slate-900 dark:text-white text-lg">{course.price === 0 ? "FREE" : `${course.price}P`}</span>
                                                <button className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">Enroll Now</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <p className="text-slate-400 font-bold italic">ไม่พบข้อมูลคอร์สแนะนำ</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Home;
