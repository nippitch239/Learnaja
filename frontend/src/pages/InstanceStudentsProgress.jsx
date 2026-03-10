import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function InstanceStudentsProgress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [instance, setInstance] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [error, setError] = useState(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [instRes, stuRes] = await Promise.all([
        api.get(`/instances/${id}/full`),
        api.get(`/instances/${id}/students-progress`),
      ]);
      setInstance(instRes.data);
      setStudents(stuRes.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลความคืบหน้าได้");
    } finally {
      setLoading(false);
    }
  };

  const reloadProgress = async () => {
    try {
      setLoadingProgress(true);
      const res = await api.get(`/instances/${id}/students-progress`);
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลความคืบหน้าของนักเรียนได้");
    } finally {
      setLoadingProgress(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadAll();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error || !instance) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-slate-500">{error || "ไม่พบข้อมูลคอร์สเรียน"}</p>
        <button
          onClick={() => navigate(`/mycourses/${id}/view`)}
          className="px-6 py-2 bg-primary text-white rounded-xl"
        >
          กลับไปหน้าคอร์ส
        </button>
      </div>
    );
  }

  const totalStudents = students.length;
  const avgProgress =
    totalStudents > 0
      ? Math.round(
          students.reduce((sum, s) => sum + (s.progress_percent || 0), 0) / totalStudents
        )
      : 0;

  return (
    <div className="bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen">
      <main className="pt-28 pb-12 max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 sticky top-28">
              <nav className="space-y-1">
                <div className="px-4 py-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  การจัดการ
                </div>

                <NavLink
                  to={`/mycourses/${id}/edit/info`}
                  end
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <span className="material-symbols-outlined">edit_note</span>
                  <span>แก้ไขข้อมูลคอร์ส</span>
                </NavLink>

                <NavLink
                  to={`/mycourses/${id}/edit`}
                  end
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <span className="material-symbols-outlined">menu_book</span>
                  <span>จัดการคอร์สเรียน</span>
                </NavLink>

                <NavLink
                  to={`/mycourses/${id}/invite`}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <span className="material-symbols-outlined">group</span>
                  <span>จัดการนักเรียน</span>
                </NavLink>

                <NavLink
                  to={`/mycourses/${id}/progress`}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <span className="material-symbols-outlined">insights</span>
                  <span>ดูความคืบหน้านักเรียน</span>
                </NavLink>

                <NavLink
                  to={`/mycourses/${id}/view`}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <span className="material-symbols-outlined">visibility</span>
                  <span>ดูตัวอย่างหน้าคอร์ส</span>
                </NavLink>
              </nav>

              <div className="mt-6 space-y-2">
                <button
                  onClick={() => navigate(`/mycourses/${id}/view`)}
                  className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-xl cursor-pointer font-bold hover:opacity-90 transition-opacity flex items-center space-x-2 w-full justify-center text-sm shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>กลับไปหน้าคอร์ส</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-8">
            <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                      Progress Overview
                    </span>
                    <span className="px-3 py-1 bg-slate-100 border border-slate-200 dark:bg-slate-800 text-slate-500 dark:border-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                      #{instance.id}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold">ความคืบหน้าการเรียนของนักเรียน</h1>
                  <p className="text-slate-400 text-sm">
                    ดูภาพรวมความคืบหน้าของนักเรียนที่ถูกเชิญให้เรียนคอร์สนี้ (ไม่รวมตัวครูผู้สอน)
                  </p>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-4 min-w-65">
                  <div className="flex gap-3 w-full">
                    <div className="flex-1 bg-white/90 dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                          จำนวนนักเรียน
                        </p>
                        <p className="text-xl font-bold">{totalStudents} คน</p>
                      </div>
                      <span className="material-symbols-outlined text-primary bg-primary/10 rounded-xl p-2">
                        group
                      </span>
                    </div>
                    <div className="flex-1 bg-white/90 dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                          ค่าเฉลี่ยความคืบหน้า
                        </p>
                        <p className="text-xl font-bold text-primary">{avgProgress}%</p>
                      </div>
                      <span className="material-symbols-outlined text-primary bg-primary/10 rounded-xl p-2">
                        insights
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={reloadProgress}
                    disabled={loadingProgress}
                    className="px-4 py-2 rounded-xl border border-slate-200 cursor-pointer dark:border-slate-700 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    รีเฟรชข้อมูล
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {students.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
                      school
                    </span>
                    <p className="text-slate-500 text-sm">
                      ยังไม่มีนักเรียนที่ถูกเชิญ หรือยังไม่มีข้อมูลความคืบหน้า
                    </p>
                    <Link
                      to={`/mycourses/${id}/invite`}
                      className="mt-3 inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline"
                    >
                      <span className="material-symbols-outlined text-sm">group_add</span>
                      เชิญนักเรียนเพิ่ม
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {students.map((s) => {
                      const safeTotal = s.total_modules || 0;
                      const safeCompleted = s.completed_modules || 0;
                      const safePercent = Math.max(
                        0,
                        Math.min(100, s.progress_percent || 0)
                      );

                      return (
                        <div
                          key={s.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {s.name?.[0] || s.username?.[0] || "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-100">
                                {s.name || s.username}
                              </p>
                              <p className="text-xs text-slate-500">{s.email}</p>
                            </div>
                          </div>
                          <div className="flex-1 sm:max-w-md">
                            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                              <span>
                                {safeCompleted}/{safeTotal} บทเรียน
                              </span>
                              <span>{safePercent}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${safePercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstanceStudentsProgress;

