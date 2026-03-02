import { useState } from "react";
import api from "../../services/api";
import UserDropdown from "../../components/UserDropdown";

function AddPoints() {
    const [points, setPoints] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");

    const handleAddPoints = async () => {
        if (!selectedUser) return;
        await api.post(`/admin/users/${selectedUser.id}/add-points`, { points });
        setMessage("เพิ่มคะแนนสำเร็จ!");
        setPoints(0);
        setTimeout(() => setMessage(""), 3000);
    };

    const newTotal = selectedUser ? selectedUser.points + (points || 0) : 0;

    return (
        <div className="max-w-xl mx-auto mt-13">
            {/* User Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 mb-4 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">ผู้ใช้ที่เลือก</p>

                {selectedUser ? (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">person</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-white">{selectedUser.username}</p>
                            <p className="text-xs text-slate-400">{selectedUser.email}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 text-slate-400">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <span className="material-symbols-outlined">person_off</span>
                        </div>
                        <p className="text-sm">ยังไม่ได้เลือกผู้ใช้</p>
                    </div>
                )}
            </div>

            {/* Points Preview */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 mb-4 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">สรุปคะแนน</p>
                <div className="flex items-center justify-between">
                    <div className="text-center">
                        <p className="text-xs text-slate-400 mb-1">คะแนนปัจจุบัน</p>
                        <p className="text-2xl font-bold text-slate-700 dark:text-white">
                            {selectedUser ? selectedUser.points : 0}
                        </p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 text-3xl">add</span>
                    <div className="text-center">
                        <p className="text-xs text-slate-400 mb-1">คะแนนที่เพิ่ม</p>
                        <p className="text-2xl font-bold text-yellow-500">{points || 0}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 text-3xl">drag_handle</span>
                    <div className="text-center">
                        <p className="text-xs text-slate-400 mb-1">รวมทั้งหมด</p>
                        <p className="text-2xl font-bold text-primary">{newTotal}</p>
                    </div>
                </div>
            </div>

            {/* Search & Input */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ค้นหาผู้ใช้ & เพิ่มคะแนน</p>
                <UserDropdown onSelect={setSelectedUser} />

                <div className="flex gap-3 mt-2">
                    <input
                        type="number"
                        value={points}
                        onClick={() => setPoints("")}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        placeholder="จำนวนคะแนน"
                        className="flex-1 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-700 dark:text-white"
                    />
                    <button
                        onClick={handleAddPoints}
                        disabled={!selectedUser}
                        className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        เพิ่มคะแนน
                    </button>
                </div>

                {message && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-2.5 text-sm font-medium">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddPoints;