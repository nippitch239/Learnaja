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


  if (loading) return <p className="text-center h-screen">Loading...</p>;

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
                                    type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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

  {/* return (
    
>>>>>>>>> Temporary merge branch 2
      </div>

      {loading && searchTerm === "" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="animate-pulse bg-slate-100 dark:bg-slate-800 h-80 rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <>
          {courses.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-700">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">sentiment_dissatisfied</span>
              <p className="text-xl text-slate-500 font-bold">No courses found matching "{searchTerm}"</p>
              <button onClick={() => setSearchTerm("")} className="mt-4 text-primary font-bold hover:underline">Clear search</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {courses.map(course => (
                <div
                  key={course.id}
                  onClick={() => { navigate(`/courses/${course.id}`) }}
                  className="group bg-white dark:bg-slate-800 rounded-4xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                        {course.category || "General"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-slate-900 dark:text-white text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 font-medium">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-700 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price</span>
                        <span className="font-black text-slate-900 dark:text-white text-xl">{course.price} P</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <span className="material-symbols-outlined font-bold">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )} */}
        </>
    //   )}
    // </div>
  );
}

export default Courses;
