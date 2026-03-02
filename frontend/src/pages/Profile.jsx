import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { fetchMyCourses, fetchInvitedCourses } from "../services/fetchCourse";

function Profile() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [myCourses, setMyCourses] = useState([]);
    const [invitedCourses, setInvitedCourses] = useState([]);
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3200";

    useEffect(() => {
        if (authLoading) return;
        if (!user) return navigate("/login");

        const loadData = async () => {
            try {
                setLoading(true);
                const profRes = await api.get("/profile/me");
                setProfile(profRes.data);

                const [mine, invited] = await Promise.all([
                    fetchMyCourses(),
                    fetchInvitedCourses()
                ]);
                setMyCourses(mine);
                setInvitedCourses(invited);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user, authLoading, navigate]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">กำลังโหลดโปรไฟล์...</p>
                </div>
            </div>
        );
    }

    if (!profile) return <div className="p-10 text-center text-red-500">ไม่พบข้อมูลโปรไฟล์</div>;

    const allMyActiveCourses = [
        ...myCourses.map((c) => ({ ...c, source: "owned" })),
        ...invitedCourses.map((c) => ({ ...c, source: "invited" }))
    ];

    return (
        <>
            <div className="font-sans bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen">
                <main className="pt-24 max-w-7xl mx-auto px-4 py-8 bg-pattern min-h-screen">
                    {/* Profile detail section */}
                    <section className="mb-12">
                        <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm bg-linear-to-br from-primary/10 to-accent-purple/20 dark:from-primary/5 dark:to-slate-800 overflow-hidden">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                <div className="relative shrink-0">
                                    <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/50 dark:border-slate-700 shadow-lg">
                                        <img
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            src={profile.image_profile ? `${API_BASE}${profile.image_profile}` : "/images/user.png"}
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-white dark:border-slate-800">
                                        <span className="material-symbols-outlined text-primary text-lg">person</span>
                                    </div>
                                </div>

                                <div className="text-center md:text-left flex-1 space-y-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                                            {profile.name || profile.username}
                                        </h1>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                                            @{profile.username}
                                        </p>
                                        {/* {profile.email && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center md:justify-start gap-1">
                                                <span className="material-symbols-outlined text-base">mail</span>
                                                {profile.email}
                                            </p>
                                        )} */}
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user.roles.includes("admin")
                                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                                    : user.roles.includes("teacher")
                                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                }`}>
                                                <span className="material-symbols-outlined text-sm">
                                                    {user.roles.includes("admin") ? "admin_panel_settings" : user.roles.includes("teacher") ? "school" : "person"}
                                                </span>
                                                {user.roles.includes("admin") ? "ผู้ดูแลระบบ" : user.roles.includes("teacher") ? "ผู้สอน" : "นักเรียน"}

                                            </span>
                                            {!user.roles.includes("teacher") && (
                                                <Link to="/register-teacher">
                                                    <button className="cursor-pointer px-3 py-1 bg-primary text-white font-bold rounded-xl hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2 shadow-sm">
                                                        <span className="material-symbols-outlined">school</span>
                                                        สมัครเป็นผู้สอน
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                                        <div className="flex flex-col items-center md:items-start">
                                            <span className="text-2xl font-bold text-primary">
                                                {profile.stats?.points?.toLocaleString() ?? 0}P
                                            </span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">คะแนนทั้งหมด</span>
                                        </div>
                                        <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
                                        <div className="flex flex-col items-center md:items-start">
                                            <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                                                {profile.stats?.completed ?? 0}
                                            </span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">เรียนจบแล้ว</span>
                                        </div>
                                        <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
                                        <div className="flex flex-col items-center md:items-start">
                                            <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                                                {profile.stats?.learning ?? 0}
                                            </span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">กำลังเรียน</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    <Link to="/edit-profile">
                                        <button className="cursor-pointer px-6 py-3 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-sm">
                                            <span className="material-symbols-outlined">edit</span>
                                            แก้ไขโปรไฟล์
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Learning section */}
                    <section className="mb-12">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">กำลังเรียนอยู่</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">คอร์สที่คุณลงทะเบียนเรียนอยู่</p>
                            </div>
                            <Link
                                className="dark:bg-primary/10 dark:border-primary/20 hover:bg-primary/20 text-sm font-bold text-primary flex items-center gap-1 bg-white/50 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700 transition-colors"
                                to="/mycourses"
                            >
                                ดูทั้งหมด<span className="material-symbols-outlined text-xs">arrow_forward</span>
                            </Link>
                        </div>

                        {allMyActiveCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {allMyActiveCourses.slice(0, 6).map((course) => (
                                    <div
                                        key={course.id}
                                        onClick={() => navigate(`/mycourses/${course.id}`)}
                                        className="cursor-pointer bg-white/50 dark:bg-slate-800/50 bg-card-light dark:bg-card-dark p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                                    >
                                        <div className="relative">
                                            <div className="aspect-video w-full rounded-xl bg-slate-100 dark:bg-slate-800 mb-4 overflow-hidden">
                                                <img
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    src={course.thumbnail_url ? (course.thumbnail_url.startsWith("http") ? course.thumbnail_url : `${API_BASE}${course.thumbnail_url}`) : "/images/user.png"}
                                                    onError={(e) => { e.target.src = "/images/user.png"; }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute top-2 left-2">
                                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${course.source === "owned"
                                                            ? "bg-primary/90 text-white"
                                                            : "bg-slate-700/90 text-white dark:bg-slate-600"
                                                        }`}>
                                                        {course.source === "owned" ? "เจ้าของคอร์ส" : "เรียนอยู่"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 line-clamp-1">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                                {course.description || "—"}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                ดูรายละเอียด
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-primary text-sm font-bold">เข้าคอร์ส</span>
                                                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-white/50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">school</span>
                                <p className="text-slate-500 font-medium">คุณยังไม่ได้ลงทะเบียนเรียนคอร์สไหนเลย</p>
                                <Link to="/courses" className="text-primary font-bold mt-2 inline-block hover:underline">ไปดูคอร์สทั้งหมด</Link>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </>
    )
};

export default Profile;