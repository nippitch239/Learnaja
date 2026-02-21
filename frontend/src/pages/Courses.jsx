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
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Explore Courses</h1>
          <p className="text-slate-500 mt-2 font-medium">Find the perfect course to advance your skills.</p>
        </div>
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder="Search by title or category..."
            className="w-full pl-12 pr-6 py-4 rounded-4xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all shadow-lg shadow-slate-200/50 dark:shadow-none font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
        </div>
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
          )}
        </>
      )}
    </div>
  );
}

export default Courses;
