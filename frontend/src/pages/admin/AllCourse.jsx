import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { fetchCourses } from "../../store/courseSlice";
import { useDispatch, useSelector } from "react-redux";

function AllCourse() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courses, loading } = useSelector((state) => state.courses);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleDelete = async (id) => {
        try {
            if (confirm("Are you sure you want to delete this course?")) {
                await api.delete(`/courses/${id}`);
                dispatch(fetchCourses());
            }
        } catch (err) {
            const msg = err.response?.data?.message || "เกิดข้อผิดพลาดในการลบคอร์ส";
            alert(msg);
            console.error(err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!courses || courses.length === 0) return (
        <div className="container mx-auto px-4 mt-10">
            <h1 className="text-xl font-bold text-primary">คอร์สเรียนทั้งหมด</h1>
            <p className="mt-5">ไม่พบคอร์สเรียน</p>
        </div>
    );

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {courses.map(course => (
                    <div
                        key={course.id}
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                        <div className="h-40 shrink-0 bg-accent-blue relative overflow-hidden">
                            {course.thumbnail_url ? (
                                <img
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    src={course.thumbnail_url.startsWith("http") ? course.thumbnail_url : `${import.meta.env.VITE_API_URL || "http://localhost:3200"}${course.thumbnail_url}`}
                                    onError={(e) => { e.target.src = "/images/no-image.png"; }}
                                    loading="lazy"
                                />
                            ) : (
                                <img src="/images/no-image.png" alt="No thumbnail" className="w-full h-full object-cover" />
                            )}
                        </div>

                        {/* Content — ขยายเต็มพื้นที่ที่เหลือ */}
                        <div className="flex flex-col flex-1 p-4 ">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded w-fit mb-2">
                                {course.category || "General"}
                            </span>

                            <p className="text-base font-bold text-primary uppercase tracking-wider mb-1 line-clamp-1">
                                {course.title}
                            </p>

                            <p className="text-sm text-slate-400 dark:text-slate-300 mb-2 line-clamp-2 flex-1">
                                {course.description}
                            </p>

                            <div className="flex items-center space-x-1 mb-3">
                                <span className="material-symbols-outlined text-yellow-400 text-[18px]">star</span>
                                <span className="text-sm font-bold dark:text-slate-300">{course.rating || 0.0}</span>
                                <span className="text-sm text-slate-400">{course.review || "-"} รีวิว</span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700 mt-auto">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">{course.price}P</span>
                                <div className="flex gap-1">
                                    <Link
                                        to={`/courses/${course.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-primary text-white px-2 py-1 rounded-lg text-[11px] font-bold hover:bg-primary/90 transition flex items-center gap-0.5"
                                    >
                                        <span className="material-symbols-outlined text-[12px]">search</span>
                                        <span className="hidden sm:inline">ดูคอร์ส</span>
                                    </Link>
                                    <Link
                                        to={`/courses/${course.id}/edit`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-[11px] font-bold hover:bg-yellow-500/90 transition flex items-center gap-0.5"
                                    >
                                        <span className="material-symbols-outlined text-[12px]">edit</span>
                                        <span className="hidden sm:inline">แก้ไข</span>
                                    </Link>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(course.id); }}
                                        className="bg-red-500 text-white px-2 py-1 rounded-lg text-[11px] font-bold hover:bg-red-500/90 transition flex items-center gap-0.5"
                                    >
                                        <span className="material-symbols-outlined text-[12px]">delete</span>
                                        <span className="hidden sm:inline">ลบ</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllCourse;