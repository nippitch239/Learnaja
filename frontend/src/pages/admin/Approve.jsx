import { useState, useEffect } from "react";
import api from "../../services/api";
import Swal from "sweetalert2";

function Approve() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3200";

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get("/teacher-requests");
            setRequests(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, action) => {
        const result = await Swal.fire({
            title: `คุณแน่ใจหรือไม่ที่จะ ${action === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'} คำขอนี้?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        });

        if (!result.isConfirmed) return;

        try {
            await api.post(`/teacher-requests/${id}/${action}`);
            Swal.fire({
                title: 'สำเร็จ!',
                text: `ทำรายการสำเร็จ (${action})`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            fetchRequests(); // Refresh list
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'เกิดข้อผิดพลาดในการทำรายการ',
                icon: 'error'
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">


            {message && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span>
                    {message}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <span className="material-symbols-outlined text-4xl">inbox</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">ยังไม่มีคำขอใหม่</h3>
                    <p className="text-slate-500 mt-2">เมื่อมีผู้ใช้งานส่งคำขอเป็นผู้สอน จะแสดงรายการที่นี่</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map(request => (
                        <div key={request.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="p-6 flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${request.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        request.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                        {request.status === 'approved' ? 'อนุมัติแล้ว' :
                                            request.status === 'rejected' ? 'ปฏิเสธ' : 'รอตรวจสอบ'}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">
                                        {new Date(request.created_at).toLocaleDateString('th-TH')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <img
                                        src={request.image_profile ? `${API_BASE}${request.image_profile}` : "/images/user.png"}
                                        alt={request.name}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800"
                                    />
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1">{request.name}</h4>
                                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                                            <span className="material-symbols-outlined text-[16px]">mail</span>
                                            <span className="line-clamp-1">{request.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">school</span>
                                            สถาบันการศึกษา
                                        </p>
                                        <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">{request.school}</p>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">description</span>
                                            ประสบการณ์
                                        </p>
                                        <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap line-clamp-4">{request.cv_text}</p>
                                    </div>

                                    {request.cv_file && (
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">image</span>
                                                รูปภาพที่แนบมา
                                            </p>
                                            <a href={`${API_BASE}${request.cv_file}`} target="_blank" rel="noreferrer">
                                                <img
                                                    src={`${API_BASE}${request.cv_file}`}
                                                    alt="CV File"
                                                    className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700 hover:opacity-90 transition-opacity cursor-pointer"
                                                />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {request.status === 'pending' && (
                                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 grid grid-cols-2 gap-3 mt-auto">
                                    <button
                                        onClick={() => handleAction(request.id, 'reject')}
                                        className="py-2.5 px-4 rounded-xl font-bold bg-white dark:bg-slate-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-xl">close</span>
                                        ปฏิเสธ
                                    </button>
                                    <button
                                        onClick={() => handleAction(request.id, 'approve')}
                                        className="py-2.5 px-4 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 border border-transparent transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-200 dark:shadow-none"
                                    >
                                        <span className="material-symbols-outlined text-xl">check</span>
                                        อนุมัติ
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Approve;