import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import { useDispatch } from "react-redux";
import { fetchCourses } from "../../store/courseSlice";

function CreateCourse() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("Programming");
  const [thumbnailSourceType, setThumbnailSourceType] = useState("url");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!thumbnailFile) {
      setPreviewUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(thumbnailFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnailFile]);

  const categories = [
    "Programming",
    "Design",
    "Business",
    "Networking",
    "Data Science",
    "Health & Wellness",
    "Cybersecurity",
    "Language"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!title) {
      return setError("กรุณากรอกชื่อคอร์ส");
    }

    try {
      setLoading(true);

      let finalThumbnailUrl = thumbnailUrl;

      if (thumbnailSourceType === "file" && thumbnailFile) {
        const formData = new FormData();
        formData.append("image", thumbnailFile);
        const uploadRes = await api.post("/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        finalThumbnailUrl = uploadRes.data.imagePath;
      }

      const res = await api.post("/courses", {
        title,
        description,
        price,
        category,
        thumbnail_url: finalThumbnailUrl,
        rating,
        rating_count: ratingCount,
      });

      console.log(res.data);
      setMessage("สร้างคอร์สสำเร็จแล้ว!");

      dispatch(fetchCourses());

      setTimeout(() => {
        navigate("/admin");
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างคอร์ส");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">add_circle</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold dark:text-white">สร้างคอร์สใหม่</h2>
            <p className="text-slate-500 text-sm">กรอกข้อมูลเบื้องต้นสำหรับคอร์สเรียนของคุณ</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ชื่อคอร์สเรียน</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น Advanced React Patterns"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">หมวดหมู่</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold cursor-pointer appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ราคา (Points)</label>
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
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">คะแนนรีวิว (0-5)</label>
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
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">จำนวนรีวิว</label>
              <input
                type="number"
                value={ratingCount}
                onChange={(e) => setRatingCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ภาพหน้าปกคอร์ส</label>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit mb-3">
              <button
                type="button"
                onClick={() => setThumbnailSourceType("url")}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${thumbnailSourceType === "url" ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                ลิงก์รูปภาพ (URL)
              </button>
              <button
                type="button"
                onClick={() => setThumbnailSourceType("file")}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${thumbnailSourceType === "file" ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                อัพโหลดไฟล์
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-32 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                {thumbnailSourceType === "url" && thumbnailUrl ? (
                  <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src = "/images/no-image.png"} />
                ) : thumbnailSourceType === "file" && previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-slate-300">image</span>
                )}
              </div>

              <div className="flex-1 flex items-center">
                {thumbnailSourceType === "url" ? (
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium dark:placeholder:text-slate-500"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setThumbnailFile(e.target.files[0]);
                      } else {
                        setThumbnailFile(null);
                      }
                    }}
                    className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer outline-none file:cursor-pointer file:transition-colors"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">รายละเอียดคอร์ส</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="อธิบายเนื้อหาโดยรวมของคอร์สนี้..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium dark:placeholder:text-slate-500"
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

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all active:scale-95"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 px-6 py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:brightness-105 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 dark:shadow-slate-900"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  สร้างคอร์สเรียน
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
