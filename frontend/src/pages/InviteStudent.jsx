import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInstance } from "../services/fetchCourse";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import AsyncSelect from "react-select/async";
import api from "../services/api";

function InviteStudent() {
    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const data = await fetchInstance(id);
                setInstance(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [id]);

    const loadUsersOptions = async (inputValue) => {
        if (!inputValue) return [];
        try {
            const res = await api.get(`/users/search?q=${inputValue}`);
            return res.data.map(u => ({ value: u.id, label: `${u.username} (${u.email})` }));
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const handleInvite = async () => {
        if (selectedOptions.length === 0) { setMessage("Please select at least one student"); return; }
        try {
            setLoading(true);
            await Promise.all(selectedOptions.map(opt => api.post(`/instances/${id}/invite`, { studentId: opt.value })));
            setMessage("เชิญนักเรียนสำเร็จ!");
            setSelectedOptions([]);
            loadStudents();
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error inviting some students");
            setTimeout(() => setMessage(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    const loadStudents = async () => {
        try {
            const res = await api.get(`/instances/${id}/students`);
            setStudents(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadStudents(); }, [id]);

    const handleDeleteInvite = async (studentId) => {
        if (!confirm("Are you sure you want to remove this student?")) return;
        try {
            setLoading(true);
            await api.delete(`/instances/${id}/invite`, { data: { studentId } });
            setMessage("นำนักเรียนออกสำเร็จ!");
            loadStudents();
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error removing student");
            setTimeout(() => setMessage(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !instance) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        </div>
    );
    if (!instance) return <p className="m-6 text-xl text-red-500">Course Instance not found</p>;

    const isTeacher = user?.roles?.includes('teacher');
    const isError = message.toLowerCase().includes("error") || message.includes("Please");

    return (
        <div className="bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-300 min-h-screen">
            <main className="pt-28 pb-12 max-w-7xl mx-auto px-4 lg:px-6">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 sticky top-28">
                            <nav className="space-y-1">
                                <div className="px-4 py-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">การจัดการ</div>
                                {[
                                    { to: `/mycourses/${id}/edit/info`, icon: "edit_note", label: "แก้ไขข้อมูลคอร์ส", end: true },
                                    { to: `/mycourses/${id}/edit`, icon: "menu_book", label: "จัดการคอร์สเรียน", end: true },
                                    { to: `/mycourses/${id}/invite`, icon: "group", label: "จัดการนักเรียน" },
                                    { to: `/mycourses/${id}/progress`, icon: "insights", label: "ดูความคืบหน้านักเรียน" },
                                    { to: `/mycourses/${id}/view`, icon: "visibility", label: "ดูตัวอย่างหน้าคอร์ส" },
                                ].map(({ to, icon, label, end }) => (
                                    <NavLink key={to} to={to} end={end}
                                        className={({ isActive }) =>
                                            `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${isActive ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`
                                        }
                                    >
                                        <span className="material-symbols-outlined">{icon}</span>
                                        <span>{label}</span>
                                    </NavLink>
                                ))}
                            </nav>
                            <div className="mt-6">
                                <button
                                    onClick={() => navigate(`/mycourses/${id}/view`)}
                                    className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center space-x-2 w-full justify-center text-sm shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                    <span>กลับไปหน้าคอร์ส</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                        <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">

                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h1 className="text-2xl font-bold">จัดการนักเรียน</h1>
                                <p className="text-slate-400 text-sm mt-1">เชิญหรือนำนักเรียนออกจากคอร์ส <span className="text-primary font-semibold">{instance.title}</span></p>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Message */}
                                {message && (
                                    <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-2 ${isError
                                        ? "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"
                                        : "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-400"}`}>
                                        <span className="material-symbols-outlined text-sm">{isError ? "error" : "check_circle"}</span>
                                        {message}
                                    </div>
                                )}

                                {/* Invite Section */}
                                {isTeacher && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                            ค้นหาและเชิญนักเรียน
                                        </label>
                                        <AsyncSelect
                                            isMulti
                                            cacheOptions
                                            loadOptions={loadUsersOptions}
                                            value={selectedOptions}
                                            onChange={setSelectedOptions}
                                            placeholder="ค้นหา username หรือ email..."
                                            className="mb-3"
                                        />
                                        <div className="flex justify-end pt-2">
                                            <button
                                                onClick={handleInvite}
                                                disabled={loading}
                                                className="px-6 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:brightness-105 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {loading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined">person_add</span>
                                                        เชิญนักเรียนที่เลือก
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Students Table */}
                        <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">นักเรียนในคอร์ส</h2>
                                    <p className="text-slate-400 text-sm mt-0.5">{students.length} คน (รวมที่รอการตอบรับ)</p>
                                </div>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Username</th>
                                        <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                                        <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">สถานะ</th>
                                        {isTeacher && <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">จัดการ</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan={isTeacher ? 4 : 3} className="px-6 py-12 text-center text-slate-400">
                                                <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">group_off</span>
                                                ยังไม่มีนักเรียนในคอร์สนี้
                                            </td>
                                        </tr>
                                    ) : students.map(student => (
                                        <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{student.username}</td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{student.email}</td>
                                            <td className="px-6 py-4">
                                                {student.status === "pending" ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                                        <span className="material-symbols-outlined text-xs">hourglass_top</span>
                                                        รอการตอบรับ
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                        <span className="material-symbols-outlined text-xs">check_circle</span>
                                                        เข้าร่วมแล้ว
                                                    </span>
                                                )}
                                            </td>
                                            {isTeacher && (
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleDeleteInvite(student.id)}
                                                        className="flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">person_remove</span>
                                                        นำออก
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default InviteStudent;