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

    const allMyActiveCourses = [...myCourses, ...invitedCourses];

    return (
        <>
            <div className="font-sans bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen">
                <main className="pt-24 max-w-7xl mx-auto px-4 py-8 bg-pattern min-h-screen">
                    <section className="mb-12 ">
                        <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 shadow-sm bg-linear-to-br from-primary/10 to-accent-purple/20 dark:from-primary/5 dark:to-slate-800 ">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                                    <img alt="User Large Avatar"
                                        className="w-full h-full object-cover"
                                        src={profile.image_profile ? `${API_BASE}${profile.image_profile}` : "/images/user.png"} />
                                </div>
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-2xl font-bold mb-1">{profile.name || profile.username}</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                                    {profile.username} • {user.roles.includes('admin') ? 'ผู้ดูแลระบบ' : user.roles.includes('teacher') ? 'ผู้สอน' : 'นักเรียน'}
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold text-primary">{profile.stats.points.toLocaleString()}P</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">คะแนนทั้งหมด</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{profile.stats.completed}</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">เรียนจบแล้ว</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{profile.stats.learning}</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">กำลังเรียน</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Link to="/edit-profile">
                                    <button className="px-5 py-2 bg-primary/10 text-primary font-bold text-sm rounded-full hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        แก้ไขโปรไฟล์
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">กำลังเรียนอยู่</h2>
                            </div>
                            <Link
                                className="dark:bg-primary/10 dark:border-primary/20 hover:bg-primary/20 text-sm font-bold text-primary flex items-center gap-1 bg-white/50 px-4 py-2 rounded-full border border-slate-100"
                                to="/mycourses">
                                ดูทั้งหมด<span className="material-symbols-outlined text-xs">arrow_forward</span>
                            </Link>
                        </div>

                        {allMyActiveCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 ">
                                {allMyActiveCourses.slice(0, 3).map((course) => (
                                    <div key={course.id} onClick={() => navigate(`/mycourses/${course.id}`)} className="cursor-pointer bg-white/50 dark:bg-slate-800 bg-card-light dark:bg-card-dark p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                                        <div className="aspect-16/10 w-full rounded-lg bg-slate-100 dark:bg-slate-800 mb-5 overflow-hidden relative">
                                            <img alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                src={course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"} />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-60"></div>
                                        </div>
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-1">{course.title}</h3>
                                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ความคืบหน้า</span>
                                            </div>
                                            <button className="bg-primary text-white w-10 h-10 flex items-center justify-center hover:opacity-90 dark:shadow-slate-900 rounded-full transition-all shadow-md shadow-pink-200">
                                                <span className="material-symbols-outlined">play_arrow</span>
                                            </button>
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