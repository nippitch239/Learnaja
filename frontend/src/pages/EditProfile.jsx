import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function EditProfile() {
    const { user, loading: authLoading, setUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [name, setName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3200";

    useEffect(() => {
        if (authLoading) return;
        if (!user) return navigate("/login");

        const loadProfile = async () => {
            try {
                const res = await api.get("/profile/me");
                setProfile(res.data);
                setName(res.data.name || "");
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [user, authLoading, navigate]);

    const handleUpdateName = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            await api.put("/profile/update", { name });
            alert("อัปเดตชื่อสำเร็จ");
            const res = await api.get("/profile/me");
            setProfile(res.data);
        } catch (err) {
            alert(err.response?.data?.message || "Error updating profile");
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return alert("รหัสผ่านใหม่ไม่ตรงกัน");
        }
        try {
            setUpdating(true);
            await api.put("/profile/password", { currentPassword, newPassword });
            alert("เปลี่ยนรหัสผ่านสำเร็จ");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            alert(err.response?.data?.message || "Error changing password");
        } finally {
            setUpdating(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profile", file);

        try {
            setUpdating(true);
            const res = await api.post("/profileImage", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("อัปโหลดรูปภาพสำเร็จ");
            setProfile({ ...profile, image_profile: res.data.imagePath });
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || "Error uploading image");
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี? การกระทำนี้ไม่สามารถย้อนกลับได้")) return;
        try {
            await api.delete("/profile/account");
            alert("ลบบัญชีสำเร็จ");
            localStorage.removeItem("token");
            window.location.href = "/login";
        } catch (err) {
            alert("Error deleting account");
        }
    };

    if (authLoading || loading) return <div className="p-10 text-center">กำลังโหลด...</div>;

    return (
        <>
            <div className="font-sans bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen my-15">
                <div className="pt-8 max-w-7xl mx-auto px-4 py-8 bg-pattern min-h-screen">
                    <div className="px-6">
                        <button
                            onClick={() => navigate("/profile")}
                            className="cursor-pointer flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group text-sm font-bold"
                        >
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600">arrow_back</span>
                            <span>กลับไปยังโปรไฟล์</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <aside className="lg:col-span-1 space-y-6">
                            <div className="bg-white/50 dark:bg-card-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
                                <div className="relative inline-block mb-4">
                                    <img alt="User Avatar"
                                        className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20 bg-slate-100"
                                        src={profile.image_profile ? `${API_BASE}${profile.image_profile}` : "/images/user.png"} />
                                    <button
                                        disabled={updating}
                                        onClick={() => fileInputRef.current.click()}
                                        className="cursor-pointer py-1 absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-base">photo_camera</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                    />
                                </div>
                                <h2 className="text-xl font-bold">{profile.username}</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">{profile.email}</p>
                            </div>

                            <div className="bg-white/50 dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-slate-400">
                                        <span className="material-symbols-outlined text-primary text-lg">stars</span>
                                        คะแนนสะสม
                                    </h3>
                                    <span className="text-primary font-bold text-lg">{profile.stats.points.toLocaleString()} P</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                        <p className="text-xs font-bold text-primary uppercase mb-1">สถานะคอร์ส</p>
                                        <div className="flex justify-between items-center text-sm">
                                            <span>กำลังเรียน:</span>
                                            <span className="font-bold">{profile.stats.learning}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm mt-1">
                                            <span>เรียนจบแล้ว:</span>
                                            <span className="font-bold">{profile.stats.completed}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <section className="lg:col-span-2 space-y-8">
                            <div className="bg-white/50 dark:bg-card-dark p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="mb-10">
                                    <h1 className="text-2xl font-bold mb-2">ตั้งค่าโปรไฟล์</h1>
                                    <p className="text-slate-500 dark:text-slate-400">อัปเดตข้อมูลส่วนตัวและรูปภาพแสดงตน</p>
                                </div>

                                {/* Update Name Form */}
                                <form onSubmit={handleUpdateName} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">person</span>
                                            ข้อมูลส่วนตัว
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">ชื่อจริงและนามสกุล</label>
                                                <input
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                                    type="text"
                                                    placeholder="กรอกชื่อจริงและนามสกุล"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">ที่อยู่อีเมล</label>
                                                <input
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed text-sm font-medium text-slate-400"
                                                    disabled
                                                    type="email"
                                                    value={profile.email}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            disabled={updating}
                                            className="cursor-pointer px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
                                            type="submit"
                                        >
                                            {updating ? "กำลังบันทึก..." : "บันทึกชื่อพื้นฐาน"}
                                        </button>
                                    </div>
                                </form>

                                <hr className="my-10 border-slate-100 dark:border-slate-800" />

                                {/* Change Password Form */}
                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">lock</span>
                                            ความปลอดภัยของบัญชี
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6 max-w-lg">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">รหัสผ่านปัจจุบัน</label>
                                                <input
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                                    placeholder="กรอกรหัสผ่านปัจจุบัน"
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">รหัสผ่านใหม่</label>
                                                    <input
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                                        placeholder="กรอกรหัสผ่านใหม่"
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">ยืนยันรหัสผ่านใหม่</label>
                                                    <input
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                                        placeholder="ยืนยันรหัสผ่านใหม่"
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="cursor-pointer text-sm font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                                            type="button"
                                        >
                                            ลบบัญชีผู้ใช้
                                        </button>
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <button
                                                onClick={() => navigate("/profile")}
                                                className="cursor-pointer w-full md:w-auto px-8 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm"
                                                type="button"
                                            >
                                                ยกเลิก
                                            </button>
                                            <button
                                                disabled={updating}
                                                className="cursor-pointer w-full md:w-auto px-8 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition-all shadow-md disabled:opacity-50 text-sm"
                                                type="submit"
                                            >
                                                {updating ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProfile;