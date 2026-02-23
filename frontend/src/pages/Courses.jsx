import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCourses } from "../services/fetchCourse";

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadCourses(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const loadCourses = async (search = "") => {
    try {
      setLoading(true);
      const data = await fetchCourses(search);
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
            <div className=" bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100">

              <main className="pt-28 pb-12 max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex flex-col space-y-8">
                <div
                    className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 gap-4">
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <div className="relative group">
                            <button
                                className="flex items-center space-x-2 px-6 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-semibold text-sm">
                                <span
                                    className="material-symbols-outlined text-xl">grid_view</span>
                                <span>หมวดหมู่</span>
                                <span
                                    className="material-symbols-outlined text-sm">expand_more</span>
                            </button>
                            <div className="absolute left-0 top-full w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-10 hidden group-hover:block">
                                <ul className="py-2">
                                    <li className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"><span className="material-symbols-outlined text-sm mr-2">code</span>Programming</li>
                                    <li className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"><span className="material-symbols-outlined text-sm mr-2">palette</span>Design</li>
                                    <li className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"><span className="material-symbols-outlined text-sm mr-2">business</span>Business</li>
                                    <li className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"><span className="material-symbols-outlined text-sm mr-2">network_check</span>Networking</li>
                                    <li className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"><span className="material-symbols-outlined text-sm mr-2">data_object</span>Data Science</li>
                                    <li className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"><span className="material-symbols-outlined text-sm mr-2">health_and_safety</span>Health &amp; Wellness</li>
                                    
                                </ul>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="hidden md:flex flex-1 max-w-xl mx-8">
                            <div className="relative w-full">
                                <span
                                    className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-300">search</span>
                                <input
                                    className="w-full bg-slate-50 border-none rounded-full dark:bg-slate-700 dark:text-slate-200 py-2 pl-12 pr-4 text-slate-700 placeholder-slate-400 transition-all focus:ring-1 focus:ring-slate-400"
                                    placeholder="ค้นหาคอร์สเรียน..."
                                    type="text" />
                            </div>
                        </div>

                    </div>
                    <div
                        className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="text-slate-400">เรียงจาก:</span>
                            <select
                                className=" bg-slate-50 border-none font-bold p-2 text-slate-700 dark:text-slate-300 dark:bg-slate-700 rounded-full focus:ring-0 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <option>ความนิยม</option>
                                <option>A - Z</option>
                                <option>Z - A</option>
                                <option>ต่ำไปสูง</option>
                                <option>สูงไปต่ำ</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">คอร์สเรียนทั้งหมด</h1>
                    <p className="text-slate-400 text-sm">แสดง 1,240 ผลลัพธ์</p>
                </div>
                {courses.length === 0 && <p>No courses found</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map(course => (
                    <div key={course.id} onClick={() => { navigate(`/courses/${course.id}`) }}
                        className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 group">
                        <div className="relative h-48 overflow-hidden">
                            <img alt="Web Dev Course"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5k3oDnPNE0cNDaQeMrmbImR8VvlDhRRoX06smqaeAa6T4aIjY881l5p9shU9yoE3TF-45Fcqb0C-9ebJqIVEe3knAJc22d4XCtkr4cNLnWpAWQqolxqYl_8MhBX0_lyEdx515Nc1cKYvBfepc4TWQXMo_CsIYhW0ilBmgcjdAUQtoG65dN_3WVzHiLHJ0G58YiH_KKdcs3uydCTIjyjOKDbtL8F7x4Xhx5NERh28woYFfI1pALMbZwIZdQNZeSuKC_vsHLdLP9dg" />
                        </div>
                        <div className="p-5">
                            <h4
                                className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h4>
                            <p
                                className="text-slate-500 dark:text-slate-400 text-sm mb-4">{course.category}</p>
                            <div className="flex items-center space-x-1 mb-4">
                                <span
                                    className="material-symbols-outlined text-yellow-400 text-[18px] fill-[1]">star</span>
                                <span className="font-bold text-sm">4.9</span>
                                <span
                                    className="text-slate-400 text-sm">(12,430)</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span
                                        className="text-2xl font-black text-primary">{course.price}P</span>
                                </div>
                                <Link onClick={(e) => e.stopPropagation()} to={`/courses/${course.id}`}>
                                <button className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-3 rounded-xl transition-all">
                                    ดูรายละเอียด
                                </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                {/* page number */}
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
      </div>
      {/* <div className="m-5">
        <h1 className="text-3xl font-bold">All Courses</h1>

        {courses.length === 0 && <p>No courses found</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 m-5">
          {courses.map(course => (
            <div key={course.id} onClick={() => { navigate(`/courses/${course.id}`) }} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-accent-blue relative overflow-hidden">
                <img alt="Web Development"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH1CR8Eq5DZ9bxjcYHrnK8UpB46himDXNwK7wU6EVTSAc8MXujUrbPhmKZvA8smmZCOpreo-VrpHOAFXQRuiffgW3lAEfghhejTxcQEp_vjuAY6PQbpk1P8XHlJLkWXBjnBT-2Oy_z43w6LQYUKPLJxpYhIqc3xWPX9i73fCeLW-Kd0VO1UHDdQJMmnpyv36cfFsuY4tEjVMg_d3PSzJVgVUYv3dmJQns6mAaQ-_8jhhPSJLuVFJe2soWd4J3twfg1NjT-ia5HZLU" />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{course.title}</p>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-2">
                   {course.description}
                </h3>
                <div className="flex items-center space-x-1 mb-4">
                  <span className="material-symbols-outlined text-yellow-400 text-[18px] fill-[1]">star</span>
                  <span className="text-sm font-bold dark:text-slate-300">4.9</span>
                  <span className="text-sm text-slate-400">(1,200 รีวิว)</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white">{course.price}P</span>
                  <Link onClick={(e) => e.stopPropagation()} to={`/courses/${course.id}`} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition cursor-pointer">
                    Look up!
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div > */}
    </>

  );
}

export default Courses;
