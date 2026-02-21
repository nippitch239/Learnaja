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



  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="m-5">
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
      </div >
    </>

  );
}

export default Courses;
