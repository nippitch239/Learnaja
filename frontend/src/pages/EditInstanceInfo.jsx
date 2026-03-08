import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditInstanceInfo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [deleting, setDeleting] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [thumbnailSourceType, setThumbnailSourceType] = useState("url");
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");

    const [category, setCategory] = useState("");
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (!thumbnailFile) {
            setPreviewUrl("");
            return;
        }
        const objectUrl = URL.createObjectURL(thumbnailFile);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [thumbnailFile]);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/instances/${id}/full`);
                const c = res.data;
                setTitle(c.title || "");
                setDescription(c.description || "");
                setThumbnailUrl(c.thumbnail_url || "");
                setCategory(c.category || "");
                setPrice(c.original_price || 0);
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

    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage("");

        if (!title.trim()) return setError("กรุณากรอกชื่อคอร์ส");

        try {
            setIsSaving(true);

            let finalThumbnailUrl = thumbnailUrl;

            if (thumbnailSourceType === "file" && thumbnailFile) {
                const formData = new FormData();
                formData.append("image", thumbnailFile);
                const uploadRes = await api.post("/upload-image", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                finalThumbnailUrl = uploadRes.data.imagePath;
            }

            await api.put(`/instances/${id}/edit`, {
                title,
                description,
                thumbnail_url: finalThumbnailUrl,
            });
            setMessage("บันทึกข้อมูลคอร์สเรียนเรียบร้อยแล้ว");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลคอร์สได้");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteInstance = async () => {
        if (!window.confirm("คุณต้องการลบคอร์สนี้ใช่หรือไม่? นักเรียนที่ถูกเชิญและความคืบหน้าที่เกี่ยวข้องจะถูกลบออกด้วย")) return;
        try {
            setDeleting(true);
            await api.delete(`/instances/${id}`);
            alert("ลบคอร์สเรียนสำเร็จแล้ว");
            navigate("/mycourses");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "ไม่สามารถลบคอร์สได้");
        } finally {
            setDeleting(false);
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
                                    to={`/mycourses/${id}/edit/info`}
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
                                    to={`/mycourses/${id}/edit`}
                                    end
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

                                <NavLink
                                    to={`/mycourses/${id}/invite`}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${isActive
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
                                        `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${isActive
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
                                        `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${isActive
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
                                    className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center space-x-2 w-full justify-center text-sm shadow-sm cursor-pointer"
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
                                    <h1 className="text-2xl font-bold">แก้ไขข้อมูลคอร์ส</h1>
                                    <p className="text-slate-400 text-sm">
                                        การเปลี่ยนแปลงที่นี่จะมีผลเฉพาะคอร์สที่คุณสอน (ดัดแปลงจากหลักสูตรหลัก)
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                            หมวดหมู่ (อ่านอย่างเดียว)
                                        </label>
                                        <input
                                            type="text"
                                            value={category}
                                            disabled
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                            ราคาเดิม (อ่านอย่างเดียว)
                                        </label>
                                        <input
                                            type="number"
                                            value={price}
                                            disabled
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        ภาพหน้าปกคอร์ส
                                    </label>

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
                                                <img
                                                    src={thumbnailUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "/images/no-image.png";
                                                    }}
                                                />
                                            ) : thumbnailSourceType === "file" && previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
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

                                <div className="flex justify-between pt-2 gap-3 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={handleDeleteInstance}
                                        disabled={deleting}
                                        className="px-4 py-3 rounded-2xl bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 font-bold border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all flex items-center gap-2 text-sm disabled:opacity-60"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                        {deleting ? "กำลังลบคอร์ส..." : "ลบคอร์สนี้"}
                                    </button>
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

export default EditInstanceInfo;
