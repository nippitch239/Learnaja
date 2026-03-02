import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function RegisterTeacher() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        school: '',
        cv_text: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkExistingRequest = async () => {
            try {
                const res = await api.get('/teacher-requests/me');
                if (res.data && res.data.status === 'pending') {
                    setIsSuccess(true);
                    setTimeout(() => {
                        navigate('/profile');
                    }, 3000);
                }
            } catch (error) {
                console.error("Error checking request status:", error);
            } finally {
                setChecking(false);
            }
        };
        checkExistingRequest();
    }, []);

    if (checking) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const data = new FormData();
            data.append('school', formData.school);
            data.append('cv_text', formData.cv_text);
            if (file) {
                data.append('cv_file', file);
            }

            await api.post('/teacher-requests', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/profile');
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'เกิดข้อผิดพลาดในการส่งคำขอ');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className=" bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100">

                <div className="min-h-screen flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-slate-800 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl">check_circle</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">ส่งคำขอสำเร็จ!</h2>
                        <p className="text-slate-500 mb-8">
                            ระบบได้รับคำขอสมัครเป็นผู้สอนของคุณแล้ว ผู้ดูแลระบบจะทำการตรวจสอบและอนุมัติในเร็วๆ นี้
                        </p>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-full animate-[shrink_3s_linear_forwards]"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=" bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-xl py-24 ">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                        <span className="material-symbols-outlined text-3xl">school</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        สมัครเป็นผู้สอน
                    </h1>
                    <p className="mt-3 text-slate-500 dark:text-slate-400">
                        แบ่งปันความรู้และประสบการณ์ของคุณกับผู้เรียนบน Learnaja
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                ชื่อ-นามสกุล <span className="text-slate-400 font-normal">(จากโปรไฟล์ของคุณ)</span>
                            </label>
                            <input
                                type="text"
                                disabled
                                value={user?.name}
                                className="block w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label htmlFor="school" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                โรงเรียน / สถาบันการศึกษา
                            </label>
                            <input
                                id="school"
                                name="school"
                                type="text"
                                required
                                value={formData.school}
                                onChange={handleChange}
                                placeholder="เช่น KMITL หรือโรงเรียนพรตพิทยพยัต"
                                className="block w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="cv_text" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                ประสบการณ์ / ความเชี่ยวชาญ
                            </label>
                            <textarea
                                id="cv_text"
                                name="cv_text"
                                rows={4}
                                required
                                value={formData.cv_text}
                                onChange={handleChange}
                                placeholder="อธิบายประสบการณ์การสอนหรือความเชี่ยวชาญของคุณแบบคร่าวๆ เพื่อประกอบการพิจารณา..."
                                className="block w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 resize-none"
                            />
                        </div>

                        <div className="">
                            <label htmlFor="cv_file" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                อัพโหลดรูปภาพ <span className="text-slate-400 font-normal">(รูปโปรไฟล์, เรซูเม่, ฯลฯ)</span>
                            </label>
                            <input
                                type="file"
                                name="cv_file"
                                id="cv_file"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="block w-full text-sm text-slate-500 dark:text-slate-400
                                  file:mr-4 file:py-3 file:px-4
                                  file:rounded-xl file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-primary/10 file:text-primary
                                  hover:file:bg-primary/20
                                  cursor-pointer outline-none file:cursor-pointer file:transition-colors"
                            />
                        </div>

                        {message && (
                            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center space-x-2">
                                <span className="material-symbols-outlined">error</span>
                                <span>{message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer w-50 flex justify-center items-center p-2 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    กำลังบันทึก...
                                </>
                            ) : (
                                "ส่งคำขอเป็นผู้สอน"
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
}

export default RegisterTeacher;