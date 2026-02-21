import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { fetchCourses } from "../../services/fetchCourse";

function AllCourse() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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


    const handleDelete = async (id) => {
        try {
            if (confirm("Are you sure you want to delete this course?")) {
                await api.delete(`/courses/${id}`);
                loadCourses();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!courses) return <p>Course not found</p>;

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-xl font-bold text-primary">All Course</h1>

            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-6 m-5">
                {courses.map(course => (

                    <div key={course.id} onClick={() => { navigate(`/courses/${course.id}`) }} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                        <div className="h-48 bg-accent-blue relative overflow-hidden">
                            <img alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                src={course.image}
                                loading="lazy" />
                        </div>
                        <div className="p-5">

                            <p className="text-xl font-bold text-primary uppercase tracking-wider mb-2">
                                {course.title}
                            </p>

                            <h3 className="font-bold text-slate-900 dark:text-white text-md mb-2 line-clamp-2">
                                {course.description}
                            </h3>

                            <div className="flex items-center space-x-1 mb-4">
                                <span className="material-symbols-outlined text-yellow-400 text-[18px] fill-[1]">star</span>
                                <span className="text-sm font-bold dark:text-slate-300">{course.rating || 0.0}</span>
                                <span className="text-sm text-slate-400">{course.review || "-"} รีวิว</span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                                <span className="font-bold text-slate-900 dark:text-white">{course.price}P</span>
                                <Link
                                    to={`/courses/${course.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-primary w-max text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition cursor-pointer">
                                    Look up!
                                </Link>
                                <Link
                                    to={`/courses/${course.id}/edit`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-yellow-500 w-max text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-500/90 transition cursor-pointer">
                                    Edit
                                </Link>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(course.id) }}
                                    className="bg-red-500 w-max text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500/90 transition cursor-pointer">
                                    Delete
                                </button>
                            </div>

                        </div>
                    </div>


                ))}
            </div>

        </div>
    );
}

export default AllCourse;