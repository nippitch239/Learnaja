import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function CourseEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("info");

    const [newModuleName, setNewModuleName] = useState("");
    const [expandedQuizzes, setExpandedQuizzes] = useState({});


    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [qModalData, setQModalData] = useState({
        quizId: null,
        question: "",
        type: "single_choice",
        choices: ["", ""],
        correctAnswers: [],
        points: 10
    });

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/courses/${id}/full`);
            setCourse(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const safeParse = (str, fallback = []) => {
        if (!str) return fallback;
        if (typeof str !== 'string') return str;
        try {
            return JSON.parse(str);
        } catch (e) {
            if (str.includes(',')) {
                return str.split(',').map(s => s.trim());
            }
            return fallback;
        }
    };

    const handleUpdateBasicInfo = async () => {
        try {
            setSubmitting(true);
            await api.put(`/courses/${id}/edit`, {
                title: course.title,
                description: course.description,
                price: course.price,
                thumbnail_url: course.thumbnail_url,
                category: course.category,
                rating: course.rating,
                rating_count: course.rating_count
            });
            setMessage("บันทึกข้อมูลทั่วไปเรียบร้อยแล้ว!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error(err);
            setMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddModule = async () => {
        if (!newModuleName) return;
        try {
            await api.post(`/courses/${id}/modules`, {
                title: newModuleName,
                order_index: course.modules?.length || 0
            });
            setNewModuleName("");
            setMessage("เพิ่มบทเรียนใหม่เรียบร้อยแล้ว");
            setTimeout(() => setMessage(""), 3000);
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (!confirm("คุณต้องการลบบทนี้และเนื้อหาทั้งหมดใช่หรือไม่?")) return;
        try {
            await api.delete(`/modules/${moduleId}`);
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddLesson = async (moduleId) => {
        const title = prompt("ชื่อบทเรียน:");
        if (!title) return;
        const videoUrl = prompt("URL วิดีโอ (ถ้ามี):", "");

        try {
            await api.post(`/modules/${moduleId}/lessons`, {
                title,
                type: 'video',
                duration_minutes: 10,
                content: { video_url: videoUrl || "" },
                order_index: 0
            });
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!confirm("คุณต้องการลบบทเรียนนี้ใชหรือไม่?")) return;
        try {
            await api.delete(`/lessons/${lessonId}`);
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddQuiz = async (moduleId) => {
        const title = prompt("ชื่อแบบทดสอบ:");
        if (!title) return;
        try {
            await api.post(`/modules/${moduleId}/quizzes`, {
                title,
                passing_score: 70
            });
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        if (!confirm("คุณต้องการลบแบบทดสอบนี้ใชหรือไม่?")) return;
        try {
            await api.delete(`/quizzes/${quizId}`);
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddAssignment = async (moduleId) => {
        const title = prompt("ชื่อหัวข้องาน:");
        if (!title) return;
        const description = prompt("รายละเอียดงาน (ถ้ามี):", "");
        try {
            await api.post(`/modules/${moduleId}/assignments`, {
                title,
                description,
                max_score: 100,
                submission_type: 'file_upload'
            });
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (!confirm("คุณต้องการลบงานชิ้นนี้ใชหรือไม่?")) return;
        try {
            await api.delete(`/assignments/${assignmentId}`);
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleQuizExpanded = (quizId) => {
        setExpandedQuizzes(prev => ({ ...prev, [quizId]: !prev[quizId] }));
    };

    const handleAddQuestion = (quizId) => {
        setQModalData({
            quizId,
            question: "",
            type: "single_choice",
            choices: ["", ""],
            correctAnswers: [],
            points: 10
        });
        setIsQuestionModalOpen(true);
    };

    const handleSaveQuestion = async () => {
        if (!qModalData.question.trim()) return alert("กรุณาระบุคำถาม");
        if (qModalData.choices.some(c => !c.trim())) return alert("กรุณาระบุตัวเลือกให้ครบ");
        if (qModalData.correctAnswers.length === 0) return alert("กรุณาเลือกคำตอบที่ถูกต้อง");

        try {
            let correctAnswer;
            if (qModalData.type === 'single_choice' || qModalData.type === 'true_false') {
                correctAnswer = qModalData.correctAnswers[0].toString();
            } else {
                correctAnswer = JSON.stringify(qModalData.correctAnswers);
            }

            await api.post(`/quizzes/${qModalData.quizId}/questions`, {
                question: qModalData.question,
                type: qModalData.type,
                choices: qModalData.choices,
                correct_answer: correctAnswer,
                points: qModalData.points
            });

            setIsQuestionModalOpen(false);
            setMessage("เพิ่มคำถามเรียบร้อยแล้ว");
            setTimeout(() => setMessage(""), 3000);
            fetchCourseData();
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการบันทึกคำถาม (ลองรีเฟรชหน้าเว็บแล้วลองใหม่)");
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!confirm("คุณต้องการลบคำถามนี้ใชหรือไม่?")) return;
        try {
            await api.delete(`/questions/${questionId}`);
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const updateQForm = (field, value) => {
        setQModalData(prev => {
            const newData = { ...prev, [field]: value };
            if (field === 'type') {
                if (value === 'true_false') {
                    newData.choices = ["ใช่ (True)", "ไม่ใช่ (False)"];
                    newData.correctAnswers = [];
                } else if (prev.type === 'true_false') {
                    newData.choices = ["", ""];
                    newData.correctAnswers = [];
                }
            }
            return newData;
        });
    };

    const toggleCorrectAnswer = (index) => {
        setQModalData(prev => {
            let newCorrects;
            if (prev.type === 'single_choice' || prev.type === 'true_false') {
                newCorrects = [index];
            } else {
                if (prev.correctAnswers.includes(index)) {
                    newCorrects = prev.correctAnswers.filter(i => i !== index);
                } else {
                    newCorrects = [...prev.correctAnswers, index];
                }
            }
            return { ...prev, correctAnswers: newCorrects };
        });
    };

    const handleChoiceChange = (index, value) => {
        const newChoices = [...qModalData.choices];
        newChoices[index] = value;
        updateQForm('choices', newChoices);
    };

    const addChoice = () => {
        updateQForm('choices', [...qModalData.choices, ""]);
    };

    const removeChoice = (index) => {
        if (qModalData.choices.length <= 2) return;
        const newChoices = qModalData.choices.filter((_, i) => i !== index);
        const newCorrects = qModalData.correctAnswers
            .filter(i => i !== index)
            .map(i => i > index ? i - 1 : i);
        setQModalData(prev => ({ ...prev, choices: newChoices, correctAnswers: newCorrects }));
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">กำลังโหลดระบบจัดการคอร์ส...</p>
            </div>
        </div>
    );

    if (!course) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-500 text-xl font-bold mb-4">ไม่พบข้อมูลคอร์สเรียน</p>
                <button onClick={() => navigate(-1)} className="text-primary hover:underline font-bold">กลับไปหน้าเดิม</button>
            </div>
        </div>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-300 min-h-screen bg-main">
            <main className="pt-28 pb-12 max-w-7xl mx-auto px-4 lg:px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 sticky top-28">
                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab("info")}
                                    className={`cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'info' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    <span className="material-symbols-outlined">info</span>
                                    <span>ข้อมูลทั่วไป</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("curriculum")}
                                    className={`cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'curriculum' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    <span className="material-symbols-outlined">menu_book</span>
                                    <span>จัดการคอร์สเรียน</span>
                                </button>
                            </nav>
                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => navigate(`/courses/${id}`)}
                                    className="cursor-pointer bg-primary text-white px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-pink-200 dark:shadow-none flex items-center space-x-2 w-full justify-center"
                                >
                                    <span className="material-symbols-outlined">visibility</span>
                                    <span>ดูหน้าคอร์สเรียน</span>
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="cursor-pointer mt-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2 w-full justify-center text-sm"
                                >
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                    <span>ย้อนกลับ</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        {activeTab === 'info' && "จัดการรายละเอียดคอร์สเรียน"}
                                        {activeTab === 'curriculum' && "จัดการเนื้อหาหลักสูตร"}
                                    </h1>
                                    <p className="text-slate-400 text-sm">
                                        {activeTab === 'info' && "จัดการรายละเอียด ชื่อคอร์สเรียน และภาพหน้าปกของคอร์สเรียน"}
                                        {activeTab === 'curriculum' && "จัดการบทเรียน วิดีโอ และแบบทดสอบต่างๆ"}
                                    </p>
                                </div>
                                {activeTab === 'curriculum' && (
                                    <div className="flex gap-2">
                                        <input
                                            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm w-48"
                                            placeholder="ชื่อบทใหม่..."
                                            value={newModuleName}
                                            onChange={(e) => setNewModuleName(e.target.value)}
                                        />
                                        <button
                                            onClick={handleAddModule}
                                            className="cursor-pointer bg-slate-900 dark:bg-primary text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all font-bold text-sm flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">add_circle</span>
                                            เพิ่มบทเรียน
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                {message && (
                                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl flex items-center animate-in slide-in-from-top-4">
                                        <span className="material-symbols-outlined mr-2">check_circle</span>
                                        <span className="font-bold">{message}</span>
                                    </div>
                                )}

                                {activeTab === 'info' && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">ชื่อคอร์สเรียน</label>
                                            <input
                                                className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                                type="text"
                                                value={course.title}
                                                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">ราคา (Points)</label>
                                                <div className="relative">
                                                    <input
                                                        className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold"
                                                        type="number"
                                                        value={course.price}
                                                        onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
                                                    />
                                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">toll</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">หมวดหมู่</label>
                                                <select
                                                    className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold cursor-pointer"
                                                    value={course.category || "Programming"}
                                                    onChange={(e) => setCourse({ ...course, category: e.target.value })}
                                                >
                                                    <option value="Programming">Programming</option>
                                                    <option value="Design">Design</option>
                                                    <option value="Business">Business</option>
                                                    <option value="Networking">Networking</option>
                                                    <option value="Data Science">Data Science</option>
                                                    <option value="Cyber Security">Cyber Security</option>
                                                    <option value="Language">Language</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">คะแนนรีวิว (0-5)</label>
                                                <div className="relative">
                                                    <input
                                                        className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold"
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="5"
                                                        value={course.rating || 0}
                                                        onChange={(e) => setCourse({ ...course, rating: Number(e.target.value) })}
                                                    />
                                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400">star</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">จำนวนรีวิว</label>
                                                <div className="relative">
                                                    <input
                                                        className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold"
                                                        type="number"
                                                        value={course.rating_count || 0}
                                                        onChange={(e) => setCourse({ ...course, rating_count: Number(e.target.value) })}
                                                    />
                                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">reviews</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">รายละเอียดคอร์สเรียน</label>
                                            <textarea
                                                className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all min-h-37.5 "
                                                value={course.description}
                                                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">ภาพหน้าปกคอร์สเรียน (URL)</label>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
                                                    <img
                                                        alt="Thumbnail Preview"
                                                        className="w-full h-full object-cover"
                                                        src={course.thumbnail_url || "/images/course-placeholder.png"}
                                                        onError={(e) => e.target.src = "https://placehold.co/600x400/fecdd3/db2777?text=No+Image"}
                                                    />
                                                </div>
                                                <input
                                                    className="flex-1 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all h-fit"
                                                    placeholder="https://example.com/image.jpg"
                                                    type="text"
                                                    value={course.thumbnail_url || ""}
                                                    onChange={(e) => setCourse({ ...course, thumbnail_url: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                            <button
                                                onClick={handleUpdateBasicInfo}
                                                disabled={submitting}
                                                className="cursor-pointer bg-primary text-white px-10 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-pink-200 dark:shadow-none disabled:opacity-50"
                                            >
                                                {submitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'curriculum' && (
                                    <div className="space-y-6">
                                        {course.modules?.length === 0 ? (
                                            <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                                                <span className="material-symbols-outlined text-5xl text-slate-300 mb-2">menu_book</span>
                                                <p className="text-slate-400 font-bold">ยังไม่เพิ่มบทเรียน</p>
                                                <p className="text-slate-400 text-sm">เริ่มต้นด้วยการเพิ่มบทใหม่ที่เมนูด้านบน</p>
                                            </div>
                                        ) : (
                                            course.modules.map((module, mIdx) => (
                                                <div key={module.id} className="space-y-4">
                                                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="material-symbols-outlined text-slate-400">drag_indicator</span>
                                                            <h3 className="font-bold text-lg">
                                                                บทที่ {mIdx + 1}: {module.title}
                                                            </h3>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleAddLesson(module.id)}
                                                                className="cursor-pointer px-3 py-1.5 bg-white dark:bg-slate-800 text-primary text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary transition-all flex items-center gap-1"
                                                            >
                                                                <span className="cursor-pointer material-symbols-outlined text-sm">add_circle</span> บทเรียน
                                                            </button>
                                                            <button
                                                                onClick={() => handleAddQuiz(module.id)}
                                                                className="cursor-pointer px-3 py-1.5 bg-white dark:bg-slate-800 text-amber-500 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all flex items-center gap-1"
                                                            >
                                                                <span className="cursor-pointer material-symbols-outlined text-sm">quiz</span> ควิซ
                                                            </button>
                                                            <button
                                                                onClick={() => handleAddAssignment(module.id)}
                                                                className="cursor-pointer px-3 py-1.5 bg-white dark:bg-slate-800 text-indigo-500 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all flex items-center gap-1"
                                                            >
                                                                <span className="cursor-pointer material-symbols-outlined text-sm">assignment</span> งาน
                                                            </button>
                                                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                                            <button
                                                                onClick={() => handleDeleteModule(module.id)}
                                                                className="cursor-pointer p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                            >
                                                                <span className="material-symbols-outlined">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-6">
                                                        {module.lessons?.map((lesson, lIdx) => (
                                                            <div key={lesson.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
                                                                <div className="flex items-center space-x-4">
                                                                    <span className="material-symbols-outlined text-slate-300">play_circle</span>
                                                                    <div>
                                                                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                                                                            {mIdx + 1}.{lIdx + 1} {lesson.title}
                                                                        </p>
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="text-[10px] text-slate-400 uppercase font-bold">Video</p>
                                                                            {lesson.content?.video_url && (
                                                                                <span className="text-[10px] text-blue-400 truncate max-w-[200px]">{lesson.content.video_url}</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDeleteLesson(lesson.id)}
                                                                    className="cursor-pointer material-symbols-outlined text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                                                >
                                                                    delete
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {module.quizzes?.map((quiz) => (
                                                            <div key={quiz.id} className="space-y-2">
                                                                <div className="flex items-center justify-between p-4 bg-amber-50/30 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30 hover:border-amber-500 transition-colors group">
                                                                    <div
                                                                        className="flex items-center space-x-4 cursor-pointer flex-1"
                                                                        onClick={() => toggleQuizExpanded(quiz.id)}
                                                                    >
                                                                        <span className={`material-symbols-outlined text-amber-500 transition-transform ${expandedQuizzes[quiz.id] ? 'rotate-180' : ''}`}>expand_more</span>
                                                                        <span className="material-symbols-outlined text-amber-300">quiz</span>
                                                                        <div>
                                                                            <p className="font-semibold text-amber-900 dark:text-amber-400">
                                                                                แบบทดสอบ: {quiz.title}
                                                                            </p>
                                                                            <p className="text-[10px] text-amber-500/60 font-bold uppercase tracking-wider">Passing: {quiz.passing_score}% • {quiz.questions?.length || 0} Questions</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => handleAddQuestion(quiz.id)}
                                                                            className="cursor-pointer px-2 py-1 bg-white dark:bg-slate-800 text-amber-600 text-[10px] font-bold rounded border border-amber-200 dark:border-amber-900 hover:bg-amber-50 transition-all opacity-0 group-hover:opacity-100"
                                                                        >
                                                                            + เพิ่มคำถาม
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteQuiz(quiz.id)}
                                                                            className="cursor-pointer material-symbols-outlined text-amber-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                                                        >
                                                                            delete
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Quiz Questions List */}
                                                                {expandedQuizzes[quiz.id] && (
                                                                    <div className="pl-12 space-y-2 pb-2 animate-in slide-in-from-top-2 duration-200">
                                                                        {quiz.questions?.length === 0 ? (
                                                                            <p className="text-xs text-slate-400 italic py-2">ยังไม่มีคำถามในครูซนี้</p>
                                                                        ) : (
                                                                            quiz.questions.map((q, qIdx) => (
                                                                                <div key={q.id} className="bg-white dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-3 rounded-xl flex items-start justify-between group/q">
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center gap-2 mb-1">
                                                                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold text-slate-500 uppercase">{q.type.replace('_', ' ')}</span>
                                                                                            <span className="text-[10px] text-primary font-bold">{q.points} Points</span>
                                                                                        </div>
                                                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                                            {qIdx + 1}. {q.question}
                                                                                        </p>
                                                                                        {q.choices && (
                                                                                            <div className="mt-2 grid grid-cols-2 gap-1 px-2">
                                                                                                {safeParse(q.choices).map((choice, cIdx) => {
                                                                                                    const parsedCorrect = safeParse(q.correct_answer, null);
                                                                                                    const isCorrect = q.correct_answer === cIdx.toString() ||
                                                                                                        (Array.isArray(parsedCorrect) && parsedCorrect.includes(cIdx)) ||
                                                                                                        (q.correct_answer === choice);
                                                                                                    return (
                                                                                                        <div key={cIdx} className={`text-[10px] flex items-center gap-1 ${isCorrect ? 'text-green-500 font-bold' : 'text-slate-400'}`}>
                                                                                                            <span className="material-symbols-outlined text-[12px]">{isCorrect ? 'check_circle' : 'circle'}</span>
                                                                                                            {choice}
                                                                                                        </div>
                                                                                                    );
                                                                                                })}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <button
                                                                                        onClick={() => handleDeleteQuestion(q.id)}
                                                                                        className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover/q:opacity-100 transition-all"
                                                                                    >
                                                                                        <span className="material-symbols-outlined text-sm">close</span>
                                                                                    </button>
                                                                                </div>
                                                                            ))
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {module.assignments?.map((assignment) => (
                                                            <div key={assignment.id} className="flex items-center justify-between p-4 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-500 transition-colors group">
                                                                <div className="flex items-center space-x-4">
                                                                    <span className="material-symbols-outlined text-indigo-300">assignment</span>
                                                                    <div>
                                                                        <p className="font-semibold text-indigo-900 dark:text-indigo-400">
                                                                            งานที่มอบหมาย: {assignment.title}
                                                                        </p>
                                                                        <p className="text-[10px] text-indigo-500/60 font-bold uppercase tracking-wider">Max Scope: {assignment.max_score} • Type: {assignment.submission_type}</p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                                                    className="cursor-pointer material-symbols-outlined text-indigo-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                                                >
                                                                    delete
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                            </div>

                            {/* Footer Links/Buttons */}
                            {activeTab !== 'info' && (
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                    <button
                                        onClick={() => setActiveTab('info')}
                                        className="cursor-pointer px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                                    >
                                        กลับไปแก้ไขข้อมูลหลัก
                                    </button>
                                    <button
                                        onClick={fetchCourseData}
                                        className="cursor-pointer bg-primary text-white px-8 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-pink-200 dark:shadow-none text-sm"
                                    >
                                        รีเฟรชข้อมูลล่าสุด
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main >

            {/* Question Creation Modal */}
            {
                isQuestionModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                <div>
                                    <h3 className="text-xl font-bold">สร้างคำถามใหม่</h3>
                                    <p className="text-xs text-slate-400">สร้างโจทย์และกำหนดตัวเลือกคำตอบสำหรับแบบทดสอบ</p>
                                </div>
                                <button
                                    onClick={() => setIsQuestionModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-6">
                                {/* Question Text */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">โจทย์คำถาม</label>
                                    <textarea
                                        className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] text-sm"
                                        placeholder="ใส่โจทย์คำถามที่นี่..."
                                        value={qModalData.question}
                                        onChange={(e) => updateQForm('question', e.target.value)}
                                    />
                                </div>

                                {/* Type & Points */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">ประเภทคำถาม</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                            value={qModalData.type}
                                            onChange={(e) => updateQForm('type', e.target.value)}
                                        >
                                            <option value="single_choice">Single Choice (เลือกได้ข้อเดียว)</option>
                                            <option value="multiple_choice">Multiple Choice (เลือกได้หลายข้อ)</option>
                                            <option value="true_false">True / False (ถูก หรือ ผิด)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">คะแนน</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                            value={qModalData.points}
                                            onChange={(e) => updateQForm('points', parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>

                                {/* Choices */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">ตัวเลือกคำตอบ</label>
                                        {qModalData.type !== 'true_false' && (
                                            <button
                                                onClick={addChoice}
                                                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                                            >
                                                <span className="material-symbols-outlined text-sm">add_circle</span> เพิ่มตัวเลือก
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {qModalData.choices.map((choice, index) => (
                                            <div key={index} className="flex items-center gap-3 group/item">
                                                <button
                                                    onClick={() => toggleCorrectAnswer(index)}
                                                    className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all ${qModalData.correctAnswers.includes(index) ? 'border-green-500 bg-green-500 text-white' : 'border-slate-200 dark:border-slate-700 hover:border-green-400'}`}
                                                >
                                                    {qModalData.correctAnswers.includes(index) && <span className="material-symbols-outlined text-xs">check</span>}
                                                </button>
                                                <input
                                                    className={`flex-1 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${qModalData.type === 'true_false' ? 'pointer-events-none opacity-80' : ''}`}
                                                    placeholder={`ตัวเลือกที่ ${index + 1}`}
                                                    value={choice}
                                                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                                                />
                                                {qModalData.type !== 'true_false' && qModalData.choices.length > 2 && (
                                                    <button
                                                        onClick={() => removeChoice(index)}
                                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-400">* คลิกที่วงกลมด้านหน้าเพื่อเลือกคำตอบที่ถูกต้อง</p>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsQuestionModalOpen(false)}
                                    className="px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleSaveQuestion}
                                    className="bg-primary text-white px-8 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-pink-200 dark:shadow-none text-sm"
                                >
                                    บันทึกคำถาม
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default CourseEdit;
