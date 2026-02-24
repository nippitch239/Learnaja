import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInstance, fetchCourseFull } from "../services/fetchCourse";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function MyDetailCourse() {
    const [instance, setInstance] = useState(null);
    const [fullCourse, setFullCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeItem, setActiveItem] = useState(null);
    const [progress, setProgress] = useState({ lessons: [], quizzes: [], assignments: [] });

    const [quizState, setQuizState] = useState({
        started: false,
        currentIndex: 0,
        answers: {},
        finished: false,
        score: 0
    });

    const [isEditing, setIsEditing] = useState(false);
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

    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const fetchFullCourseData = async () => {
        try {
            const res = await api.get(`/instances/${id}/full`);
            setFullCourse(res.data);
        } catch (err) {
            console.error("Failed to fetch full course data", err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const instanceData = await fetchInstance(id);
                setInstance(instanceData);

                const res = await api.get(`/instances/${id}/full`);
                const fullData = res.data;
                setFullCourse(fullData);

                await fetchProgress();

                await fetchProgress();

                // We no longer auto-select the first lesson here.
                // The user will see the Overview page first.
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const fetchProgress = async () => {
        try {
            const res = await api.get(`/instances/${id}/progress`);
            setProgress(res.data);
        } catch (err) {
            console.error("Failed to fetch progress", err);
        }
    };

    const handleCustomize = async () => {
        if (!window.confirm("ต้องการปรับแต่งคอร์สนี้ใช่หรือไม่? (จะทำการคัดลอกเนื้อหาจากต้นฉบับมาให้คุณแก้ไขได้)")) return;
        try {
            setLoading(true);
            await api.post(`/instances/${id}/customize`);
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to customize");
        } finally {
            setLoading(false);
        }
    };


    const handleAddModule = async () => {
        if (!newModuleName) return;
        try {
            await api.post(`/instances/${id}/modules`, {
                title: newModuleName,
                order_index: fullCourse.modules?.length || 0
            });
            setNewModuleName("");
            fetchFullCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (!confirm("คุณต้องการลบบทนี้และเนื้อหาทั้งหมดใช่หรือไม่?")) return;
        try {
            await api.delete(`/modules/${moduleId}`);
            fetchFullCourseData();
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
            fetchFullCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!confirm("คุณต้องการลบบทเรียนนี้หรือไม่?")) return;
        try {
            await api.delete(`/lessons/${lessonId}`);
            fetchFullCourseData();
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
            fetchFullCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        if (!confirm("คุณต้องการลบแบบทดสอบนี้หรือไม่?")) return;
        try {
            await api.delete(`/quizzes/${quizId}`);
            fetchFullCourseData();
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
            fetchFullCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (!confirm("คุณต้องการลบงานชิ้นนี้หรือไม่?")) return;
        try {
            await api.delete(`/assignments/${assignmentId}`);
            fetchFullCourseData();
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
            fetchFullCourseData();
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการบันทึกคำถาม");
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!confirm("คุณต้องการลบคำถามนี้หรือไม่?")) return;
        try {
            await api.delete(`/questions/${questionId}`);
            fetchFullCourseData();
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

    const safeParse = (str, fallback = []) => {
        if (!str) return fallback;
        if (typeof str !== 'string') return str;
        try {
            return JSON.parse(str);
        } catch (e) {
            return fallback;
        }
    };

    const saveProgress = async (type, contentId) => {
        try {
            await api.post(`/instances/${id}/progress`, {
                content_type: type,
                content_id: contentId
            });
            setProgress(prev => ({
                ...prev,
                [type === 'lesson' ? 'lessons' : 'assignments']: [...new Set([...prev[type === 'lesson' ? 'lessons' : 'assignments'], contentId])]
            }));
        } catch (err) {
            console.error("Failed to save progress", err);
        }
    };

    const saveQuizResult = async (quizId, score, passed) => {
        try {
            await api.post(`/instances/${id}/quiz-result`, {
                quiz_id: quizId,
                score,
                passed
            });
            await fetchProgress();
        } catch (err) {
            console.error("Failed to save quiz result", err);
        }
    };

    const handleSelectLesson = (lesson) => {
        setActiveItem({ type: 'lesson', data: lesson });
        saveProgress('lesson', lesson.id);
    };

    const handleSelectAssignment = (item) => {
        setActiveItem({ type: 'assignment', data: item });
        saveProgress('assignment', item.id);
    };

    const handleSelectQuiz = (quiz) => {
        setActiveItem({ type: 'quiz', data: quiz });
        setQuizState({
            started: false,
            currentIndex: 0,
            answers: {},
            finished: false,
            score: 0
        });
    };

    const handleStartQuiz = () => {
        setQuizState(prev => ({ ...prev, started: true }));
    };

    const handleAnswerQuiz = (questionId, value, type) => {
        setQuizState(prev => {
            const currentAnswers = prev.answers[questionId];
            let newValue;

            if (type === 'multiple_choice') {
                const arr = Array.isArray(currentAnswers) ? currentAnswers : (currentAnswers ? [currentAnswers] : []);
                if (arr.includes(value)) {
                    newValue = arr.filter(v => v !== value);
                } else {
                    newValue = [...arr, value];
                }
            } else {
                newValue = value;
            }

            return {
                ...prev,
                answers: { ...prev.answers, [questionId]: newValue }
            };
        });
    };

    const handleSubmitQuiz = () => {
        const quiz = activeItem.data;
        let score = 0;

        quiz.questions?.forEach(q => {
            const userAnswer = quizState.answers[q.id];
            const choices = safeParse(q.choices, []);
            const correctParsed = safeParse(q.correct_answer, q.correct_answer);

            if (q.type === 'multiple_choice') {
                if (Array.isArray(userAnswer) && Array.isArray(correctParsed)) {
                    const uSorted = [...userAnswer].map(String).sort();
                    const cSorted = [...correctParsed].map(String).sort();
                    if (JSON.stringify(uSorted) === JSON.stringify(cSorted)) {
                        score += q.points;
                    }
                }
            } else {
                if (String(userAnswer) === String(correctParsed)) {
                    score += q.points;
                }
                else if (userAnswer !== undefined && choices[userAnswer] === q.correct_answer) {
                    score += q.points;
                }
            }
        });

        const passed = score >= (activeItem.data.passing_score / 100 * activeItem.data.questions?.reduce((a, q) => a + q.points, 0));
        saveQuizResult(activeItem.data.id, score, passed);

        setQuizState(prev => ({ ...prev, finished: true, score }));
    };


    const isTeacher = user?.roles?.includes('teacher');

    const handleStartLearning = () => {
        if (!fullCourse?.modules) return;

        // Try to find the first incomplete lesson
        let targetLesson = null;
        for (const module of fullCourse.modules) {
            for (const lesson of module.lessons || []) {
                if (!progress.lessons.includes(lesson.id)) {
                    targetLesson = lesson;
                    break;
                }
            }
            if (targetLesson) break;
        }

        // Fallback to the very first lesson if all are completed or none found
        if (!targetLesson && fullCourse.modules[0]?.lessons?.[0]) {
            targetLesson = fullCourse.modules[0].lessons[0];
        }

        if (targetLesson) {
            handleSelectLesson(targetLesson);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-slate-400">กำลังเตรียมเนื้อหาการเรียน...</p>
            </div>
        </div>
    );

    if (!instance || !fullCourse) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold text-red-500">ไม่พบข้อมูลคอร์สเรียน</h1>
                <button onClick={() => navigate(-1)} className="text-primary font-bold hover:underline">ย้อนกลับ</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617]">
            {/* Header / Nav */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => activeItem ? setActiveItem(null) : navigate(-1)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                        >
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="font-black text-lg text-slate-900 dark:text-white line-clamp-1">{instance.title}</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                คอร์สของฉัน • {instance.role === 'owner' ? 'เจ้าของคอร์ส' : 'นักเรียน'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {instance.role === 'owner' && isTeacher && (
                            <button
                                onClick={() => navigate(`/mycourses/${instance.id}/invite`)}
                                className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">person_add</span>
                                <span>เชิญนักเรียน</span>
                            </button>
                        )}
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveItem(null)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!activeItem ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                ภาพรวม
                            </button>
                            <button
                                onClick={handleStartLearning}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeItem ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                การเรียนรูู้
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {!activeItem ? (
                /* Course Overview UI (Mirroring CourseDetail) */
                <div className="animate-in fade-in duration-500">
                    {/* Hero Section */}
                    <div className="bg-pink-50 dark:bg-slate-900/50 pt-10 pb-12 border-b border-pink-100 dark:border-slate-800">
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                                <div className="max-w-3xl space-y-4">
                                    {fullCourse.category && (
                                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                            {fullCourse.category}
                                        </span>
                                    )}
                                    <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                        {fullCourse.title}
                                    </h1>
                                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                                        {fullCourse.description}
                                    </p>
                                </div>

                                <div className="flex flex-col items-start lg:items-end gap-4 min-w-[320px]">
                                    <div className="flex bg-white/50 dark:bg-slate-800/50 p-4 rounded-3xl border border-white/20 backdrop-blur-sm w-full">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ความคืบหน้า</p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${Math.round(((progress.lessons.length) / (fullCourse.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 1)) * 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-black text-primary">
                                                    {Math.round(((progress.lessons.length) / (fullCourse.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 1)) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleStartLearning}
                                        className="w-full bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2"
                                    >
                                        <span className="material-symbols-outlined">play_circle</span>
                                        <span>{progress.lessons.length > 0 ? 'เรียนต่อเลย' : 'เริ่มเรียนเลย'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-3xl border border-white dark:border-slate-700 shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <span className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">schedule</span>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">เนื้อหาทั้งหมด</p>
                                        <p className="font-bold text-sm">{fullCourse.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} บทเรียน</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">quiz</span>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">แบบทดสอบ</p>
                                        <p className="font-bold text-sm">{fullCourse.modules?.reduce((acc, m) => acc + (m.quizzes?.length || 0), 0)} ชุด</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">assignment</span>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">งานที่มอบหมาย</p>
                                        <p className="font-bold text-sm">{fullCourse.modules?.reduce((acc, m) => acc + (m.assignments?.length || 0), 0)} งาน</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">stars</span>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">สถานะ</p>
                                        <p className="font-bold text-sm">{instance.role === 'owner' ? 'เจ้าของคอร์ส' : 'ผู้เรียน'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main className="container mx-auto px-6 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Left Column: Curriculum */}
                            <div className="lg:col-span-8 space-y-8">
                                <section>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-3xl font-bold">รายละเอียดหลักสูตร</h3>
                                        <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-bold text-slate-500">
                                            {fullCourse.modules?.length || 0} บทเรียนหลัก
                                        </span>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                                        {fullCourse.modules && fullCourse.modules.length > 0 ? (
                                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {fullCourse.modules.map((module, idx) => (
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
                                                                                <span className={`material-symbols-outlined text-[18px] ${progress.lessons.includes(lesson.id) ? 'text-green-500' : ''}`}>
                                                                                    {progress.lessons.includes(lesson.id) ? 'check_circle' : (lesson.type === 'video' ? 'play_circle' : 'description')}
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
                            </div>

                            {/* Right Column: Sidebar */}
                            <div className="lg:col-span-4 space-y-8">
                                <div className="sticky top-28">
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden group">
                                        <div className="relative rounded-2xl overflow-hidden aspect-video mb-4">
                                            <img
                                                src={fullCourse.thumbnail_url || "https://placehold.co/600x400/fecdd3/db2777?text=No+Image"}
                                                alt={fullCourse.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div
                                                onClick={handleStartLearning}
                                                className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            >
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
                                                    <span>เข้าถึงได้ทุกที่ ทุกเวลา</span>
                                                </li>
                                                <li className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                                                    <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                                                    <span>มีแบบทดสอบวัดระดับ</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            ) : (
                /* Original Learning Player UI */
                <div className="container mx-auto px-6 py-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* Main Content Area */}
                        <div className="lg:col-span-8">
                            {activeItem?.type === 'lesson' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white dark:border-slate-800 group">
                                        {activeItem.data.content?.video_url ? (
                                            <iframe
                                                className="w-full h-full"
                                                src={activeItem.data.content.video_url.includes('youtube.com') || activeItem.data.content.video_url.includes('youtu.be')
                                                    ? activeItem.data.content.video_url.replace('watch?v=', 'embed/')
                                                    : activeItem.data.content.video_url}
                                                title={activeItem.data.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
                                                <span className="material-symbols-outlined text-6xl opacity-20 mb-4">menu_book</span>
                                                <p className="font-bold text-lg">เนื้อหานี้เป็นบทความอ่านประกอบ</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-3xl shadow-sm">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase">{activeItem.data.type}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-slate-400 text-xs font-bold uppercase">{activeItem.data.duration_minutes} Minutes</span>
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">{activeItem.data.title}</h2>
                                        <div className="prose dark:prose-invert max-w-none">
                                            <h4 className="flex items-center gap-2 font-black text-slate-800 dark:text-white border-l-4 border-primary pl-4 mb-4 uppercase text-sm tracking-wider">เนื้อหาบทเรียน / รายละเอียด</h4>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                                {activeItem.data.content?.transcript || "ไม่มีรายละเอียดเพิ่มเติมสำหรับบทเรียนนี้"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeItem?.type === 'quiz' && (
                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
                                    {!quizState.started ? (
                                        <div className="p-12 text-center space-y-8">
                                            <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center mx-auto text-amber-500">
                                                <span className="material-symbols-outlined text-5xl">quiz</span>
                                            </div>
                                            <div className="space-y-2">
                                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase">แบบทดสอบ: {activeItem.data.title}</h2>
                                                <p className="text-slate-400 font-medium">ทำคะแนนให้ถึง {activeItem.data.passing_score}% เพื่อผ่านการทดสอบ</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Questions</p>
                                                    <p className="text-xl font-black text-slate-900 dark:text-white">{activeItem.data.questions?.length || 0}</p>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Points</p>
                                                    <p className="text-xl font-black text-slate-900 dark:text-white">{activeItem.data.questions?.reduce((acc, q) => acc + q.points, 0) || 0}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleStartQuiz}
                                                className="bg-primary text-white px-12 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-pointer"
                                            >
                                                เริ่มทำแบบทดสอบ
                                            </button>
                                        </div>
                                    ) : quizState.finished ? (
                                        <div className="p-12 text-center space-y-8">
                                            <div className={`w-24 h-24 ${quizState.score >= (activeItem.data.passing_score / 100 * activeItem.data.questions?.reduce((a, q) => a + q.points, 0)) ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'} rounded-3xl flex items-center justify-center mx-auto`}>
                                                <span className="material-symbols-outlined text-5xl">{quizState.score >= (activeItem.data.passing_score / 100 * activeItem.data.questions?.reduce((a, q) => a + q.points, 0)) ? 'emoji_events' : 'sentiment_very_dissatisfied'}</span>
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase">
                                                    {quizState.score >= (activeItem.data.passing_score / 100 * activeItem.data.questions?.reduce((a, q) => a + q.points, 0)) ? 'ยินดีด้วย! คุณผ่านแล้ว' : 'พยายามใหม่อีกครั้ง'}
                                                </h2>
                                                <p className="text-slate-400 font-bold mt-2 text-xl">คะแนนของคุณ: <span className="text-primary">{quizState.score}</span> / {activeItem.data.questions?.reduce((a, q) => a + q.points, 0)}</p>
                                            </div>
                                            <button
                                                onClick={() => handleSelectQuiz(activeItem.data)}
                                                className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                            >
                                                ทำแบบทดสอบอีกครั้ง
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-10 space-y-8">
                                            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-black text-xs">{quizState.currentIndex + 1}</span>
                                                    <p className="font-bold text-slate-400 text-xs uppercase tracking-widest">คำถามจากทั้งหมด {activeItem.data.questions?.length} ข้อ</p>
                                                </div>
                                                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((quizState.currentIndex + 1) / activeItem.data.questions?.length) * 100}%` }}></div>
                                                </div>
                                            </div>

                                            {activeItem.data.questions?.[quizState.currentIndex] && (
                                                <div className="space-y-6">
                                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-snug">
                                                        {activeItem.data.questions[quizState.currentIndex].question}
                                                    </h3>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {safeParse(activeItem.data.questions[quizState.currentIndex].choices).map((choice, cIdx) => {
                                                            const q = activeItem.data.questions[quizState.currentIndex];
                                                            const isSelected = q.type === 'multiple_choice'
                                                                ? (Array.isArray(quizState.answers[q.id]) && quizState.answers[q.id].includes(cIdx.toString()))
                                                                : (quizState.answers[q.id] === cIdx.toString());

                                                            return (
                                                                <button
                                                                    key={cIdx}
                                                                    onClick={() => handleAnswerQuiz(q.id, cIdx.toString(), q.type)}
                                                                    className={`p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center gap-4 ${isSelected
                                                                        ? 'bg-primary/5 border-primary text-primary shadow-sm'
                                                                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
                                                                >
                                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-primary bg-primary' : 'border-slate-200'}`}>
                                                                        {isSelected && <span className="w-2 h-2 bg-white rounded-full"></span>}
                                                                    </div>
                                                                    {choice}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                                                <button
                                                    disabled={quizState.currentIndex === 0}
                                                    onClick={() => setQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }))}
                                                    className="px-6 py-3 font-bold text-slate-400 disabled:opacity-30 hover:text-slate-600 transition-colors"
                                                >
                                                    ย้อนกลับ
                                                </button>
                                                {quizState.currentIndex === activeItem.data.questions?.length - 1 ? (
                                                    <button
                                                        onClick={handleSubmitQuiz}
                                                        className="bg-primary text-white px-10 py-3 rounded-xl font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                                                    >
                                                        ส่งคำตอบ
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }))}
                                                        className="bg-slate-900 dark:bg-slate-700 text-white px-10 py-3 rounded-xl font-black hover:opacity-90 transition-all"
                                                    >
                                                        ข้อถัดไป
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeItem?.type === 'assignment' && (
                                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                    <div className="bg-indigo-600 p-12 rounded-3xl text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <span className="material-symbols-outlined text-[120px]">assignment</span>
                                        </div>
                                        <div className="relative z-10 space-y-4">
                                            <span className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest">Project Assignment</span>
                                            <h2 className="text-4xl font-black uppercase tracking-tight">{activeItem.data.title}</h2>
                                            <p className="text-white/70 font-medium max-w-xl">
                                                กำหนดเวลาส่งและรายละเอียดงานจะระบุอยู่ด้านล่าง กรุณาตรวจสอบให้ครบถ้วนก่อนส่งงาน
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-500">
                                                <span className="material-symbols-outlined">stars</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Max Score</p>
                                                <p className="text-xl font-black text-slate-900 dark:text-white">{activeItem.data.max_score} pts</p>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-500">
                                                <span className="material-symbols-outlined">description</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Submission</p>
                                                <p className="text-xl font-black text-slate-900 dark:text-white uppercase">{activeItem.data.submission_type.replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-500">
                                                <span className="material-symbols-outlined">check_circle</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                                                <p className="text-xl font-black text-slate-900 dark:text-white">Not Submitted</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-3xl shadow-sm">
                                        <h4 className="flex items-center gap-2 font-black text-slate-800 dark:text-white border-l-4 border-indigo-500 pl-4 mb-6 uppercase text-sm tracking-wider">คำอธิบายงาน</h4>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-10 whitespace-pre-line">
                                            {activeItem.data.description || "ไม่มีคำอธิบายสำหรับงานนี้"}
                                        </p>

                                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center space-y-4">
                                            <span className="material-symbols-outlined text-4xl text-slate-300">upload_file</span>
                                            <p className="text-sm font-bold text-slate-400">ลากไฟล์มาวางที่นี่ หรือ <span className="text-primary hover:underline cursor-pointer">เลือกไฟล์</span> เพื่อส่งงาน</p>
                                            <p className="text-[10px] text-slate-400 uppercase">รองรับไฟล์: .PDF, .ZIP (ไม่เกิน 10MB)</p>
                                        </div>

                                        <div className="mt-8 flex justify-end">
                                            <button className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-black shadow-lg shadow-indigo-200 dark:shadow-none hover:opacity-90 transition-all cursor-pointer">
                                                ส่งมอบงานชิ้นนี้
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Area */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-4xl shadow-sm flex flex-col h-[calc(100vh-160px)] sticky top-28">
                                <div className="flex items-center justify-between mb-8 px-2">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">เนื้อหาบทเรียน</h3>
                                    {instance?.role === 'owner' && fullCourse?.modules?.some(m => m.instance_id) && (
                                        <span className="bg-primary/10 text-primary text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider border border-primary/20">Customized</span>
                                    )}
                                </div>

                                {instance?.role === 'owner' && user.roles.includes('teacher') && fullCourse?.modules?.every(m => !m.instance_id) && (
                                    <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-3xl mb-8">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600">
                                                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">เนื้อหาจากต้นฉบับ</p>
                                        </div>
                                        <p className="text-[11px] text-amber-600/80 dark:text-amber-400/60 mb-4 font-medium leading-relaxed">คอร์สนี้ใช้เนื้อหาจากต้นฉบับ คุณสามารถเริ่มการปรับแต่งเพื่อแก้ไขบทเรียนได้โดยไม่กระทบต้นฉบับ</p>
                                        <button
                                            onClick={handleCustomize}
                                            className="w-full py-3 bg-amber-500 text-white rounded-2xl text-[11px] font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-95 cursor-pointer uppercase tracking-widest"
                                        >
                                            ปรับแต่งเนื้อหา
                                        </button>
                                    </div>
                                )}

                                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                                    {fullCourse?.modules?.map((module, mIdx) => (
                                        <div key={module.id} className="space-y-3">
                                            <div className="flex items-center justify-between px-2 py-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest shrink-0">M{mIdx + 1}</span>
                                                    <h4 className="font-black text-slate-900 dark:text-white text-[11px] uppercase truncate">{module.title}</h4>
                                                </div>
                                                {instance?.role === 'owner' && module.instance_id && (
                                                    <button onClick={() => handleDeleteModule(module.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                )}
                                            </div>

                                            {/* Teacher Action Buttons for Module */}
                                            {instance?.role === 'owner' && user.roles.includes('teacher') && module.instance_id && (
                                                <div className="flex flex-wrap gap-1 px-2 mb-2">
                                                    <button onClick={() => handleAddLesson(module.id)} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hover:bg-primary/20 transition-colors">+ Lesson</button>
                                                    <button onClick={() => handleAddQuiz(module.id)} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hover:bg-amber-500/20 transition-colors">+ Quiz</button>
                                                    <button onClick={() => handleAddAssignment(module.id)} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hover:bg-indigo-500/20 transition-colors">+ Task</button>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                {module.lessons?.map((lesson) => (
                                                    <div key={lesson.id} className="relative group">
                                                        <button
                                                            onClick={() => handleSelectLesson(lesson)}
                                                            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left border-2 group ${activeItem?.type === 'lesson' && activeItem.data.id === lesson.id
                                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                                : 'bg-[#F8FAFC] dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                                                }`}
                                                        >
                                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${activeItem?.type === 'lesson' && activeItem.data.id === lesson.id ? 'bg-white/20' : 'bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600'
                                                                }`}>
                                                                {progress.lessons.includes(lesson.id) ? (
                                                                    <span className="material-symbols-outlined text-[18px] text-green-500">check_circle</span>
                                                                ) : (
                                                                    <span className={`material-symbols-outlined text-[18px] ${activeItem?.type === 'lesson' && activeItem.data.id === lesson.id ? 'text-white' : 'text-slate-400'}`}>play_circle</span>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-[11px] truncate">{lesson.title}</p>
                                                                <p className={`text-[9px] font-bold uppercase mt-0.5 ${activeItem?.type === 'lesson' && activeItem.data.id === lesson.id ? 'text-white/70' : 'text-slate-400'}`}>
                                                                    {lesson.duration_minutes}m • {lesson.type}
                                                                </p>
                                                            </div>
                                                        </button>
                                                        {instance?.role === 'owner' && module.instance_id && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                                                            >
                                                                <span className="material-symbols-outlined text-[14px]">delete</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}

                                                {module.quizzes?.map(quiz => {
                                                    const quizResult = progress.quizzes.find(r => r.quiz_id === quiz.id);
                                                    const isPassed = quizResult?.passed;

                                                    return (
                                                        <div key={quiz.id} className="space-y-1 group relative">
                                                            <button
                                                                onClick={() => handleSelectQuiz(quiz)}
                                                                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left border-2 group ${activeItem?.type === 'quiz' && activeItem.data.id === quiz.id
                                                                    ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20'
                                                                    : 'bg-amber-50/50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-500 border-amber-100 dark:border-amber-900/30 hover:border-amber-300'
                                                                    }`}
                                                            >
                                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${activeItem?.type === 'quiz' && activeItem.data.id === quiz.id ? 'bg-white/20' : 'bg-white dark:bg-amber-900/30 border border-amber-100 dark:border-amber-900/60'
                                                                    }`}>
                                                                    {isPassed ? (
                                                                        <span className="material-symbols-outlined text-[18px] text-green-500">task_alt</span>
                                                                    ) : (
                                                                        <span className={`material-symbols-outlined text-[18px] ${activeItem?.type === 'quiz' && activeItem.data.id === quiz.id ? 'text-white' : 'text-amber-500'}`}>quiz</span>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-bold text-[11px] truncate uppercase tracking-tight">Quiz: {quiz.title}</p>
                                                                    <p className={`text-[9px] font-bold uppercase mt-0.5 ${activeItem?.type === 'quiz' && activeItem.data.id === quiz.id ? 'text-white/70' : 'text-amber-500/60'}`}>
                                                                        {isPassed ? `Passed: ${quizResult.score} pts` : `${quiz.questions?.length || 0} Questions`}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                            {instance?.role === 'owner' && module.instance_id && (
                                                                <div className="absolute right-2 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                                    <button onClick={(e) => { e.stopPropagation(); handleAddQuestion(quiz.id); }} className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg">
                                                                        <span className="material-symbols-outlined text-[14px]">add_circle</span>
                                                                    </button>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(quiz.id); }} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                                        <span className="material-symbols-outlined text-[14px]">delete</span>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}

                                                {module.assignments?.map(item => (
                                                    <div key={item.id} className="relative group">
                                                        <button
                                                            onClick={() => handleSelectAssignment(item)}
                                                            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left border-2 group ${activeItem?.type === 'assignment' && activeItem.data.id === item.id
                                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                                                                : 'bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-500 border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-300'
                                                                }`}
                                                        >
                                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${activeItem?.type === 'assignment' && activeItem.data.id === item.id ? 'bg-white/20' : 'bg-white dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-900/60'
                                                                }`}>
                                                                {progress.assignments.includes(item.id) ? (
                                                                    <span className="material-symbols-outlined text-[18px] text-green-500">check_circle</span>
                                                                ) : (
                                                                    <span className={`material-symbols-outlined text-[18px] ${activeItem?.type === 'assignment' && activeItem.data.id === item.id ? 'text-white' : 'text-indigo-500'}`}>assignment</span>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-[11px] truncate uppercase tracking-tight">งาน: {item.title}</p>
                                                                <p className={`text-[9px] font-bold uppercase mt-0.5 ${activeItem?.type === 'assignment' && activeItem.data.id === item.id ? 'text-white/70' : 'text-indigo-500/60'}`}>
                                                                    {progress.assignments.includes(item.id) ? 'Submitted' : `${item.max_score} pts • ${item.submission_type}`}
                                                                </p>
                                                            </div>
                                                        </button>
                                                        {instance?.role === 'owner' && module.instance_id && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteAssignment(item.id); }}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                                                            >
                                                                <span className="material-symbols-outlined text-[14px]">delete</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {(!fullCourse?.modules || fullCourse.modules.length === 0) && (
                                        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                            <p className="text-slate-400 italic text-[10px] font-bold">ยังไม่มีเนื้อหาในคอร์สนี้</p>
                                        </div>
                                    )}

                                    {instance?.role === 'owner' && fullCourse?.modules?.some(m => m.instance_id) && (
                                        <div className="mt-4 px-2">
                                            <div className="flex gap-2 mb-4">
                                                <input
                                                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                                                    placeholder="ชื่อโมดูลใหม่..."
                                                    value={newModuleName}
                                                    onChange={(e) => setNewModuleName(e.target.value)}
                                                />
                                                <button
                                                    onClick={handleAddModule}
                                                    className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-bold hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
                                                >
                                                    เพิ่มบทเรียน
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Question Creation Modal (Teacher Only) */}
            {isQuestionModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <div>
                                <h3 className="text-xl font-bold">สร้างคำถามใหม่</h3>
                                <p className="text-xs text-slate-400">สร้างโจทย์และกำหนดตัวเลือกสำหรับแบบทดสอบ</p>
                            </div>
                            <button onClick={() => setIsQuestionModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase">คำถาม / โจทย์</label>
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all min-h-[100px]"
                                    placeholder="ใส่คำถามที่นี่..."
                                    value={qModalData.question}
                                    onChange={(e) => updateQForm('question', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase">ประเภทคำถาม</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm"
                                        value={qModalData.type}
                                        onChange={(e) => updateQForm('type', e.target.value)}
                                    >
                                        <option value="single_choice">Single Choice (หนึ่งคำตอบ)</option>
                                        <option value="multiple_choice">Multiple Choice (หลายคำตอบ)</option>
                                        <option value="true_false">True / False (ใช่-ไม่ใช่)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase">คะแนน (Points)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm"
                                        value={qModalData.points}
                                        onChange={(e) => updateQForm('points', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="block text-xs font-bold text-slate-400 uppercase">ตัวเลือกคำตอบ <span className="text-primary font-medium lowercase italic">(ติกเลือกข้อที่ถูกต้อง)</span></label>
                                    {qModalData.type !== 'true_false' && (
                                        <button onClick={addChoice} className="text-primary text-[10px] font-black uppercase hover:underline">+ เพิ่มตัวเลือก</button>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {qModalData.choices.map((choice, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <button
                                                onClick={() => toggleCorrectAnswer(idx)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2 ${qModalData.correctAnswers.includes(idx) ? 'bg-green-500 border-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300'}`}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                            </button>
                                            <input
                                                className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm"
                                                placeholder={`ตัวเลือกที่ ${idx + 1}`}
                                                value={choice}
                                                readOnly={qModalData.type === 'true_false'}
                                                onChange={(e) => handleChoiceChange(idx, e.target.value)}
                                            />
                                            {qModalData.type !== 'true_false' && qModalData.choices.length > 2 && (
                                                <button onClick={() => removeChoice(idx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                            <button onClick={() => setIsQuestionModalOpen(false)} className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all">ยกเลิก</button>
                            <button onClick={handleSaveQuestion} className="bg-primary text-white px-8 py-2 rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all">บันทึกคำถาม</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyDetailCourse;
