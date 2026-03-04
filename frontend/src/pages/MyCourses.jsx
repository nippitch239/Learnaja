import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchMyCourses, fetchInvitedCourses, fetchPendingInvites } from "../services/fetchCourse";
import api from "../services/api";

function MyCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [fetching, setFetching] = useState(true);

    const { user, loading } = useContext(AuthContext);
    const [invitedCourses, setInvitedCourses] = useState([]);
    const [fetchingInvited, setFetchingInvited] = useState(true);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [fetchingPending, setFetchingPending] = useState(true);

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate('/login');

        const loadAll = async () => {
            try {
                const myRes = await fetchMyCourses();
                setCourses(myRes || []);
                setFetching(false);

                const invitedRes = await fetchInvitedCourses();
                setInvitedCourses(invitedRes || []);
                setFetchingInvited(false);

                const pendingRes = await fetchPendingInvites();
                setPendingInvites(pendingRes || []);
                setFetchingPending(false);
            } catch (err) {
                console.error("Failed to fetch courses", err);
                setFetching(false);
                setFetchingInvited(false);
                setFetchingPending(false);
            }
        };

        loadAll();
    }, [user, loading, navigate]);

    if (loading || fetching || fetchingInvited || fetchingPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold animate-pulse">กำลังโหลดคอร์สของคุณ...</p>
                </div>
            </div>
        );
    }

    const CourseCard = ({ course, type }) => (
        <div
            key={course.id}
            onClick={() => navigate(`/mycourses/${course.id}/view`)}
            className="group relative bg-white dark:bg-slate-900 rounded-3xl p-1 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800 cursor-pointer overflow-hidden"
        >
            {/* Gradient Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative p-6 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary border border-slate-100 dark:border-slate-700 group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
                        <span className="material-symbols-outlined text-3xl">
                            {type === 'owner' ? 'school' : 'person_add'}
                        </span>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded-full uppercase tracking-widest">
                        ID: #{course.id}
                    </span>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-1">
                        {course.title}
                    </h3>
                    {type === 'invited' && course.owner_name && (
                        <p className="text-[11px] font-bold text-slate-400">
                            ผู้สอน: <span className="text-slate-600 dark:text-slate-300">{course.owner_name}</span>
                        </p>
                    )}
                    <p className="text-sm text-slate-500 line-clamp-2 min-h-10">
                        {course.description || ""}
                    </p>
                    {course.thumbnail_url ? (
                        <div className="aspect-video w-full rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
                            <img
                                src={course.thumbnail_url.startsWith('http') ? course.thumbnail_url : `${import.meta.env.VITE_API_URL || 'http://localhost:3200'}${course.thumbnail_url}`}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => { e.target.src = "/images/user.png"; }}
                            />
                        </div>
                    ) : (
                        <div className="aspect-video w-full rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2 flex items-center justify-center">
                            <span className="material-symbols-outlined text-5xl text-slate-300">school</span>
                        </div>
                    )}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>แก้ไขล่าสุดเมื่อเร็วๆ นี้</span>
                    </div>
                    <button
                        className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-lg"
                        onClick={(e) => { e.stopPropagation(); navigate(`/mycourses/${course.id}/view`); }}
                    >
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const EmptyState = ({ title }) => (
        <div className="col-span-full py-16 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                <span className="material-symbols-outlined text-4xl">folder_off</span>
            </div>
            <h4 className="text-lg font-bold text-slate-400">{title}</h4>
            <p className="text-sm text-slate-400/80 mt-1">คุณยังไม่มีคอร์สในรายการนี้</p>
            {title === "คอร์สที่คุณเป็นเจ้าของ" && (
                <Link to="/courses" className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-bold text-sm shadow-lg shadow-pink-100 dark:shadow-none hover:bg-primary/90 transition-all flex items-center gap-2">
                    เลือกซื้อคอร์สที่สนใจ
                </Link>
            )}
        </div>
    );

    const handleAcceptInvite = async (instanceId) => {
        try {
            await api.post(`/instances/${instanceId}/accept-invite`);
            setPendingInvites(prev => prev.filter(c => c.id !== instanceId));

            const accepted = pendingInvites.find(c => c.id === instanceId);
            if (accepted) {
                setInvitedCourses(prev => [...prev, accepted]);
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "ไม่สามารถยอมรับคำเชิญได้");
        }
    };

    const handleRejectInvite = async (instanceId) => {
        try {
            await api.post(`/instances/${instanceId}/reject-invite`);
            setPendingInvites(prev => prev.filter(c => c.id !== instanceId));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "ไม่สามารถปฏิเสธคำเชิญได้");
        }
    };

    return (
        <div className=" bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12 space-y-12 tracking-normal">
                <section
                    className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 to-accent-purple/20 dark:from-primary/5 dark:to-slate-800 p-8 md:p-16 border border-primary/10">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                            คอร์สของคุณ <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-300 py-2">
                                และการเรียนรู้ของคุณ
                            </span>
                        </h1>
                        <p className="text-lg text-slate-500 mb-0 leading-relaxed">
                            ติดตามความคืบหน้าของคอร์สของคุณ และเริ่มเรียนรู้สิ่งใหม่ๆได้เลย
                        </p>
                    </div>

                </section>
            </div>
            {/* Owned Courses Section */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
                <div className="space-y-12">
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                คอร์สที่คุณเป็นเจ้าของ
                            </h2>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {courses.length === 0 ? (
                                <EmptyState title="คอร์สที่คุณเป็นเจ้าของ" />
                            ) : (
                                courses.map(course => <CourseCard key={course.id} course={course} type="owner" />)
                            )}
                        </div>
                    </section>

                    {/* Pending Invites Section */}
                    {pendingInvites.length > 0 && (
                        <section className="pt-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-1.5 h-8 bg-amber-400 rounded-full"></div>
                                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                    คำเชิญที่รอการตอบรับ
                                </h2>
                                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {pendingInvites.map(course => (
                                    <div
                                        key={course.id}
                                        className="group relative bg-white dark:bg-slate-900 rounded-3xl p-1 shadow-sm border border-amber-200 dark:border-amber-700/60 overflow-hidden"
                                    >
                                        <div className="relative p-6 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 border border-amber-100 dark:border-amber-700">
                                                    <span className="material-symbols-outlined text-3xl">
                                                        person_add
                                                    </span>
                                                </div>
                                                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/40 text-[10px] font-bold text-amber-700 dark:text-amber-300 rounded-full uppercase tracking-widest">
                                                    Pending
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                                                    {course.title}
                                                </h3>
                                                {course.owner_name && (
                                                    <p className="text-[11px] font-bold text-slate-400">
                                                        ผู้สอน: <span className="text-slate-600 dark:text-slate-300">{course.owner_name}</span>
                                                    </p>
                                                )}
                                                <p className="text-sm text-slate-500 line-clamp-2 min-h-10">
                                                    {course.description || ""}
                                                </p>
                                                <div className="">
                                                    <img
                                                        className="w-full h-48 object-cover rounded-2xl"
                                                        src={course.thumbnail_url.startsWith("http") ? course.thumbnail_url : `${import.meta.env.VITE_API_URL || "http://localhost:3200"}${course.thumbnail_url}`}
                                                        alt={course.title} />
                                                </div>
                                            </div>

                                            <div className="pt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-800">
                                                <button
                                                    className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition flex items-center gap-1"
                                                    onClick={() => handleAcceptInvite(course.id)}
                                                >
                                                    <span className="material-symbols-outlined text-sm">check</span>
                                                    ยอมรับ
                                                </button>
                                                <button
                                                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1"
                                                    onClick={() => handleRejectInvite(course.id)}
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                    ปฏิเสธ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Invited Courses Section */}
                    {invitedCourses.length > 0 && (
                        <section className="pt-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                    คอร์สที่คุณได้รับเชิญ
                                </h2>
                                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {invitedCourses.map(course => <CourseCard key={course.id} course={course} type="invited" />)}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyCourses;
