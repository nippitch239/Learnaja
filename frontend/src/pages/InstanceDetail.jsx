import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function InstanceDetail() {
    const { id } = useParams();
    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState({ lessons: [], assignments: [], quizzes: [] });
    const [totalItemsCount, setTotalItemsCount] = useState(0);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const loadInstanceData = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/instances/${id}/full`);
                setInstance(res.data);

                let total = 0;
                res.data.modules?.forEach(m => {
                    total += (m.lessons?.length || 0);
                    total += (m.quizzes?.length || 0);
                    total += (m.assignments?.length || 0);
                });
                setTotalItemsCount(total);

                try {
                    const progRes = await api.get(`/instances/${id}/progress`);
                    setProgress(progRes.data);
                } catch (e) {
                    console.error("Failed to fetch progress", e);
                }
            } catch (err) {
                console.error(err);
                setError("ไม่สามารถโหลดรายละเอียดคอร์สได้");
            } finally {
                setLoading(false);
            }
        };
        loadInstanceData();
    }, [id, user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (error || !instance) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <p className="text-slate-500">{error || "ไม่พบข้อมูลคอร์สเรียน"}</p>
            <button onClick={() => navigate('/mycourses')} className="px-6 py-2 bg-primary text-white rounded-xl">กลับสู่หน้าคอร์สของฉัน</button>
        </div>
    );

    return (
        <div className="bg-main min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100">
            <div className="bg-linear-to-br from-primary/10 to-accent-purple/20 dark:from-primary/5 dark:to-slate-800 p-8 md:p-16 border border-primary/10">
                <div className="max-w-7xl mx-auto px-6 mt-8">
                    <button
                        onClick={() => navigate('/mycourses')}
                        className="flex items-center space-x-2 text-primary font-bold transition-colors mb-6 group"
                    >
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        <span>ย้อนกลับ</span>
                    </button>

                    <div className="space-y-8">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                            <div className="max-w-3xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                        Instance #{instance.id}
                                    </span>
                                    {instance.category && (
                                        <span className="px-3 py-1 bg-slate-100 border border-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-full uppercase tracking-wider">
                                            {instance.category}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                    {instance.title}
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                                    {instance.description}
                                </p>
                            </div>

                            <div className="flex flex-col items-start lg:items-end gap-4 min-w-[320px]">
                                <div className="flex gap-3 w-full">
                                    <Link
                                        to={`/mycourses/${id}`}
                                        className="flex-1 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 dark:shadow-none hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                                    >
                                        <span className="material-symbols-outlined">play_arrow</span>
                                        <span>เริ่มเรียนเลย</span>
                                    </Link>

                                    {instance.owner_id === user.id && user?.roles?.includes("teacher") && (
                                        <Link
                                            to={`/mycourses/${id}/edit`}
                                            className="flex items-center justify-center bg-slate-900 dark:bg-white dark:text-slate-900 text-white p-4 rounded-2xl font-bold hover:opacity-90 transition-opacity"
                                            title="แก้ไขหลักสูตร"
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats - Adapted */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-3xl border border-white dark:border-slate-700 shadow-sm">
                            <div className="flex items-center space-x-3">
                                <span className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">schedule</span>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">ใช้เวลา</p>
                                    <p className="font-bold text-sm">24.5 ชั่วโมง</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">bar_chart</span>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">ระดับ</p>
                                    <p className="font-bold text-sm">พื้นฐาน - กลาง</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">language</span>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">ภาษา</p>
                                    <p className="font-bold text-sm">ไทย</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">bookmark</span>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">สถานะ</p>
                                    <p className="font-bold text-sm">เป็นเจ้าของแล้ว</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Curriculum */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-bold">รายละเอียดหลักสูตร</h3>
                                <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-bold text-slate-500">
                                    {instance.modules?.length || 0} บทเรียน
                                </span>
                            </div>

                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                                {instance.modules && instance.modules.length > 0 ? (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {instance.modules.map((module, idx) => (
                                            <div key={module.id} className="group p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                            <span className="text-primary font-bold">{idx + 1}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-lg font-bold group-hover:text-primary transition-colors">
                                                                {module.title}
                                                            </span>
                                                            <div className="mt-4 space-y-3">
                                                                {module.lessons?.map((lesson) => (
                                                                    <div key={lesson.id} className="flex items-center text-sm text-slate-500 space-x-3">
                                                                        <span className="material-symbols-outlined text-[18px]">
                                                                            {lesson.type === 'video' ? 'play_circle' : 'description'}
                                                                        </span>
                                                                        <span>{lesson.title}</span>
                                                                    </div>
                                                                ))}
                                                                {module.quizzes?.map((quiz) => (
                                                                    <div key={quiz.id} className="flex items-center text-sm text-slate-500 space-x-3">
                                                                        <span className="material-symbols-outlined text-[18px]">quiz</span>
                                                                        <span>แบบทดสอบ: {quiz.title}</span>
                                                                    </div>
                                                                ))}
                                                                {module.assignments?.map((assignment) => (
                                                                    <div key={assignment.id} className="flex items-center text-sm text-slate-500 space-x-3">
                                                                        <span className="material-symbols-outlined text-[18px]">assignment</span>
                                                                        <span>งาน: {assignment.title}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">inventory_2</span>
                                        <p className="text-slate-500 font-medium">ยังไม่มีรายละเอียดบทเรียน</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-8">
                        {instance.thumbnail_url && (
                            <div className="sticky top-28">
                                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden group">
                                    <div className="relative rounded-2xl overflow-hidden aspect-video mb-4">
                                        <img
                                            src={instance.thumbnail_url.startsWith('http') ? instance.thumbnail_url : `${import.meta.env.VITE_API_URL || 'http://localhost:3200'}${instance.thumbnail_url}`}
                                            alt={instance.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { e.target.src = "/images/user.png"; }}
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Link to={`/mycourses/${id}`} className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl">
                                                <span className="material-symbols-outlined text-4xl fill-1">play_arrow</span>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-2 space-y-4">
                                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">ความคืบหน้าของฉัน</h4>
                                        {(() => {
                                            const modules = instance.modules || [];
                                            const totalModules = modules.length;

                                            const finishedModulesCount = modules.filter(module => {
                                                const lessons = module.lessons || [];
                                                const quizzes = module.quizzes || [];
                                                const assignments = module.assignments || [];

                                                if (lessons.length === 0 && quizzes.length === 0 && assignments.length === 0) return false;

                                                const lessonsDone = lessons.every(l => progress.lessons.includes(Number(l.id)));
                                                const assignmentsDone = assignments.every(a => progress.assignments.includes(Number(a.id)));
                                                const quizzesDone = quizzes.every(q =>
                                                    progress.quizzes.some(pq => pq.quiz_id === q.id && (pq.passed == 1 || pq.passed === true))
                                                );

                                                return lessonsDone && assignmentsDone && quizzesDone;
                                            }).length;

                                            const pct = totalModules > 0 ? Math.round((finishedModulesCount / totalModules) * 100) : 0;
                                            return (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs font-bold">
                                                        <span className="text-slate-400">PROGRESS</span>
                                                        <span className="text-primary">{pct}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 font-medium">{finishedModulesCount} / {totalModules} บทเรียน</p>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default InstanceDetail;
