import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCourses } from "../services/fetchCourse";


function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);



  if (loading) return <p className="text-center h-screen">Loading...</p>;

  return (
    <div className="  bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 bg-main">
      <div style={{ marginTop: "20px" }}>
        {courses.length === 0 && <p>ไม่พบคอร์สเรียน</p>}

        {courses.map(course => (
            <main className="pt-28 pb-12 max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex flex-col space-y-8">
                <div
                    className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 gap-4">
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <div className="relative group">
                            <button
                                className="flex items-center space-x-2 px-6 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-semibold text-sm">
                                <span
                                    className="material-symbols-outlined text-xl">grid_view</span>
                                <span>หมวดหมู่</span>
                                <span
                                    className="material-symbols-outlined text-sm">expand_more</span>
                            </button>
                        </div>
                        <button
                            className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity font-semibold text-sm">
                            <span
                                className="material-symbols-outlined text-xl">tune</span>
                            <span>ฟิลเตอร์</span>
                        </button>
                    </div>
                    <div
                        className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="hidden sm:flex items-center space-x-4">
                            <span
                                className="text-xs font-bold uppercase tracking-wider text-slate-400">แท็กยอดนิยม :</span>
                            <div className="flex space-x-2">
                                <span
                                    className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">React</span>
                                <span
                                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-full">Python</span>
                                <span
                                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-full">UI
                                    Design</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="text-slate-400">เรียงตาม:</span>
                            <select
                                className="bg-transparent border-none font-bold text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer p-0">
                                <option>ยอดนิยม</option>
                                <option>ใหม่ล่าสุด</option>
                                <option>คะแนน: ต่ำไปสูง</option>
                                <option>คะแนน: สูงไปต่ำ</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">คอร์สเรียนทั้งหมด</h1>
                    <p className="text-slate-400 text-sm">แสดง {courses.length} ผลลัพธ์</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div key={course.id} onClick={() => { navigate(`/courses/${course.id}`) }} className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 group">
                        <div className="relative h-48 overflow-hidden">
                            <img alt=""
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                src="/images/user.png" />
                        </div>
                        <div className="p-5">
                            <h4
                                className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{course.description}</p>

                            <div className="flex items-center space-x-1 mb-4">
                                <span
                                    className="material-symbols-outlined text-yellow-400 text-[18px] fill-[1]">star</span>
                                <span className="font-bold text-sm">4.8</span>
                                <span
                                    className="text-slate-400 text-sm">(8,122)</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span
                                        className="text-2xl font-black text-primary">{course.price}P</span>
                                </div>
                                 <Link onClick={(e) => e.stopPropagation()} to={`/courses/${course.id}`} className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-3 rounded-xl transition-all">
                                    ดูรายละเอียด
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 flex justify-center space-x-2">
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 hover:text-primary transition-colors">
                        <span
                            className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md">1</button>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 hover:text-primary transition-colors">2</button>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 hover:text-primary transition-colors">3</button>
                    <span
                        className="w-10 h-10 flex items-center justify-center text-slate-400">...</span>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 hover:text-primary transition-colors">12</button>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 hover:text-primary transition-colors">
                        <span
                            className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>
        </main>

        ))}
      </div>
    </div>
  );
}

export default Courses;
