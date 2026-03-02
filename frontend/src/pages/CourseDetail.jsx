import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { fetchCourseFull, fetchMyCourses } from "../services/fetchCourse";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ownedInstances, setOwnedInstances] = useState([]);
  const [message, setMessage] = useState("");
  const [buying, setBuying] = useState(false);
  const [showInstances, setShowInstances] = useState(false);
  const [ratings, setRatings] = useState([]);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3200";

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);
        const res = await fetchCourseFull(id);
        setCourse(res);
        if (user) {
          await calculateOwnership();
        }
        await fetchRatings();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCourseData();
  }, [id, user]);

  const calculateOwnership = async () => {
    try {
      const data = await fetchMyCourses();
      const instances = data?.filter(c => c.template_id === parseInt(id)) || [];
      setOwnedInstances(instances);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await api.get(`/courses/${id}/ratings`);
      setRatings(res.data);
    } catch (err) {
      console.error("Failed to fetch ratings", err);
    }
  };

  const handleBuy = async () => {
    if (!user) return navigate('/login');
    try {
      setBuying(true);
      const res = await api.post(`/courses/${id}/buy`, {
        id: user.id
      });
      setMessage(res.data.message || "ซื้อคอร์สสำเร็จ!");
      await calculateOwnership();
      window.dispatchEvent(new Event("profileUpdated"));
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "เกิดข้อผิดพลาดในการซื้อ");
      setTimeout(() => setMessage(""), 4000);
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">กำลังโหลดข้อมูลคอร์ส...</p>
        </div>
      </div>
    );
  }

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500">ไม่พบข้อมูลคอร์สเรียน</p>
    </div>
  );

  return (
      <div className=" bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100">
      {/* Hero Section */}
      
      <div className="bg-linear-to-br from-primary/10 to-accent-purple/20 dark:from-primary/5 dark:to-slate-800 p-8 md:p-16 border border-primary/10k pt-24 pb-12 border-b  border-pink-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-primary font-bold transition-colors mb-6 group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span>ย้อนกลับ</span>
          </button>

          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-3xl space-y-4">
                {course.category && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                    {course.category}
                  </span>
                )}
                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {course.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {course.description}
                </p>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-4 min-w-[320px]">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-black text-primary">
                    {course.price === 0 ? "FREE" : `${course.price}P`}
                  </span>
                </div>

                {/* Buy Button */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleBuy}
                    disabled={buying}
                    className="flex-1 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 dark:shadow-none hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {buying ? (
                      <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span><span>กำลังซื้อ...</span></>
                    ) : (
                      <><span className="material-symbols-outlined">shopping_cart</span><span>{ownedInstances.length > 0 ? "ซื้อเพิ่มอีกคอร์ส" : "ซื้อคอร์สนี้"}</span></>
                    )}
                  </button>

                  {user?.roles?.includes('admin') && (
                    <Link
                      to={`/courses/${id}/edit`}
                      className="flex items-center justify-center bg-slate-900 dark:bg-white dark:text-slate-900 text-white p-4 rounded-2xl font-bold hover:opacity-90 transition-opacity"
                      title="แก้ไขหลักสูตร"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </Link>

                  )}
                </div>

                {/* Message */}
                {message && (
                  <p className="text-sm font-bold text-primary animate-pulse flex items-center space-x-1">
                    <span className="material-symbols-outlined text-base">info</span>
                    <span>{message}</span>
                  </p>
                )}

                {/* Owned Instances List */}
                {ownedInstances.length > 0 && (
                  <div className="w-full mt-2">
                    <button
                      onClick={() => setShowInstances(!showInstances)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <span className="flex items-center space-x-2 font-bold text-primary text-sm">
                        <span className="material-symbols-outlined text-base">library_books</span>
                        <span>คอร์สที่คุณซื้อแล้ว ({ownedInstances.length} คอร์ส)</span>
                      </span>
                      <span className={`material-symbols-outlined text-primary text-sm transition-transform ${showInstances ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    {showInstances && (
                      <div className="mt-2 rounded-xl border border-primary/20 overflow-hidden divide-y divide-primary/10">
                        {ownedInstances.map((inst, idx) => (
                          <button
                            key={inst.id}
                            onClick={() => navigate(`/mycourses/${inst.id}/view`)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary/5 transition-colors text-left group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-bold text-sm">{idx + 1}</span>
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
                                  {inst.title}
                                </p>
                                <p className="text-xs text-slate-400">Instance #{inst.id}</p>
                              </div>
                            </div>
                            <span className="material-symbols-outlined text-primary text-base">arrow_forward</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
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
                <span className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">grade</span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">คะแนน</p>
                  <p className="font-bold text-sm">
                    {(course.rating || 0).toFixed(1)}
                    <span className="text-slate-400 font-medium ml-1">
                      ({course.rating_count > 1000 ? (course.rating_count / 1000).toFixed(1) + 'k' : course.rating_count || 0})
                    </span>
                  </p>
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
                  {course.modules?.length || 0} บทเรียน
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                {course.modules && course.modules.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {course.modules.map((module, idx) => (
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

            {/* Reviews Section */}
            <section className="mt-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold">รีวิวจากผู้เรียน</h3>
                <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-bold text-slate-500">
                  {ratings.length} รีวิว
                </span>
              </div>

              {ratings.length > 0 ? (
                <div className="space-y-6">
                  {ratings.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="shrink-0 flex md:flex-col items-center gap-3">
                        <img
                          src={review.image_profile ? `${API_BASE}${review.image_profile}` : "/images/user.png"}
                          alt={review.name || review.username}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/10"
                        />
                        <div className="md:text-center">
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{review.name || review.username}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified Learner</p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span key={s} className={`material-symbols-outlined text-lg ${s <= review.rating ? 'text-yellow-400 fill-1' : 'text-slate-200'}`}>
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {new Date(review.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
                          "{review.comment || 'ไม่มีความแเห็นเพิ่มเติม'}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">rate_review</span>
                  <p className="text-slate-400 font-bold text-sm">ยังไม่มีรีวิวสำหรับคอร์สนี้</p>
                  <p className="text-slate-400 text-xs">เป็นคนแรกที่รีวิวหลังจากเรียนจบ!</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            {course.thumbnail_url && (
              <div className="sticky top-28">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden group">
                  <div className="relative rounded-2xl overflow-hidden aspect-video mb-4">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl">
                        <span className="material-symbols-outlined text-4xl fill-1">play_arrow</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 space-y-4">
                    <h4 className="font-bold text-lg">คอร์สนี้รวมอะไรบ้าง?</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                        <span>เข้าชมได้ตลอดชีพ</span>
                      </li>
                      <li className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                        <span>เข้าถึงบนอุปกรณ์ใดก็ได้</span>
                      </li>
                    </ul>
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

export default CourseDetail;
