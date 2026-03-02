import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function CourseInfoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/courses/${id}`);
        const c = res.data;
        setTitle(c.title || "");
        setDescription(c.description || "");
        setPrice(c.price || 0);
        setCategory(c.category || "");
        setThumbnailUrl(c.thumbnail_url || "");
        setRating(c.rating || 0);
        setRatingCount(c.rating_count || 0);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลคอร์สได้");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const categories = [
    "Programming",
    "Design",
    "Business",
    "Networking",
    "Data Science",
    "Health & Wellness",
    "Cybersecurity",
    "Language",
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");

    if (!title.trim()) return setError("กรุณากรอกชื่อคอร์ส");

    try {
      setIsSaving(true);
      await api.put(`/courses/${id}/edit`, {
        title,
        description,
        price: Number(price) || 0,
        category,
        thumbnail_url: thumbnailUrl,
        rating: Number(rating) || 0,
        rating_count: Number(ratingCount) || 0,
      });
      setMessage("บันทึกข้อมูลคอร์สเรียบร้อยแล้ว");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลคอร์สได้");
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <div className="bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-300 min-h-screen">
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
                  to={`/courses/${id}/edit`}
                  end
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <span className="material-symbols-outlined">edit_note</span>
                  <span>แก้ไขข้อมูลคอร์ส</span>
                </NavLink>

                <NavLink
                  to={`/courses/${id}/edit/curriculum`}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <span className="material-symbols-outlined">menu_book</span>
                  <span>จัดการคอร์สเรียน</span>
                </NavLink>

                <Link
                  to={`/courses/${id}`}
                  className="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                >
                  <span className="material-symbols-outlined">visibility</span>
                  <span>ดูหน้าคอร์ส</span>
                </Link>
              </nav>

              <div className="mt-6 space-y-2">
                <button
                  onClick={() => navigate(-1)}
                  className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center space-x-2 w-full justify-center text-sm shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>กลับไปหน้าเดิม</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-8">
            <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold">แก้ไขข้อมูลคอร์สหลัก</h1>
                  <p className="text-slate-400 text-sm">
                    การเปลี่ยนแปลงที่นี่จะมีผลกับคอร์สหลัก และอินสแตนซ์ที่ยังไม่ได้ปรับแต่ง
                  </p>
                </div>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    ชื่อคอร์สเรียน
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      หมวดหมู่
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold cursor-pointer appearance-none"
                    >
                      <option value="">เลือกหมวดหมู่</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      ราคา (Points)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Rating (0-5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Rating Count
                    </label>
                    <input
                      type="number"
                      value={ratingCount}
                      onChange={(e) => setRatingCount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    ภาพหน้าปกคอร์ส (URL)
                  </label>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-32 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/images/user.png";
                          }}
                        />
                      ) : (
                        <span className="material-symbols-outlined text-slate-300">image</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    รายละเอียดคอร์ส
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                  </div>
                )}

                {message && (
                  <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    {message}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:brightness-105 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined">save</span>
                        บันทึกข้อมูลคอร์ส
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourseInfoEdit;

