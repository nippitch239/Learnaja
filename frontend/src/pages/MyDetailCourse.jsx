import { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import 'quill/dist/quill.snow.css';

function MyDetailCourse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openModule, setOpenModule] = useState(0);
    const [activeItem, setActiveItem] = useState(null);
    const [videoPlaying, setVideoPlaying] = useState(false);
    const iframeRef = useRef(null);

    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState({ earned: 0, total: 0 });

    // Progress
    const [progress, setProgress] = useState({ lessons: [], assignments: [], quizzes: [] });
    const [totalItemsCount, setTotalItemsCount] = useState(0);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchCourseData = async () => {
            try {
                const res = await api.get(`/instances/${id}/full`);
                setCourse(res.data);

                // Calculate total items
                let total = 0;
                res.data.modules?.forEach(m => {
                    total += (m.lessons?.length || 0);
                    total += (m.quizzes?.length || 0);
                    total += (m.assignments?.length || 0);
                });
                setTotalItemsCount(total);

                // Fetch initial progress
                try {
                    const progRes = await api.get(`/instances/${id}/progress`);
                    // Normalize content_ids to numbers (SQLite may return strings)
                    setProgress({
                        lessons: (progRes.data.lessons || []).map(Number),
                        assignments: (progRes.data.assignments || []).map(Number),
                        quizzes: progRes.data.quizzes || []
                    });
                } catch (e) {
                    console.error("Failed to fetch progress", e);
                }

                // Set initial active item
                if (res.data.modules && res.data.modules.length > 0) {
                    const firstModule = res.data.modules[0];
                    if (firstModule.lessons && firstModule.lessons.length > 0) {
                        setActiveItem({ type: 'lesson', data: firstModule.lessons[0], moduleIndex: 0 });
                    } else if (firstModule.quizzes && firstModule.quizzes.length > 0) {
                        setActiveItem({ type: 'quiz', data: firstModule.quizzes[0], moduleIndex: 0 });
                    } else if (firstModule.assignments && firstModule.assignments.length > 0) {
                        setActiveItem({ type: 'assignment', data: firstModule.assignments[0], moduleIndex: 0 });
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load course details");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id, user, navigate]);

    useEffect(() => {
        if (activeItem && activeItem.type === 'lesson' && !progress.lessons.includes(Number(activeItem.data.id))) {
            api.post(`/instances/${id}/progress`, {
                content_type: 'lesson',
                content_id: activeItem.data.id
            }).then(() => {
                setProgress(prev => ({
                    ...prev,
                    lessons: [...new Set([...prev.lessons, Number(activeItem.data.id)])]
                }));
            }).catch(console.error);
        }
    }, [activeItem, id]);

    const toggleModule = (index) => {
        setOpenModule(prev => prev === index ? null : index);
    };

    const handleItemClick = (type, data, moduleIndex) => {
        setActiveItem({ type, data, moduleIndex });
        setVideoPlaying(false);
        setQuizStarted(false);
        setQuizSubmitted(false);
        setQuizAnswers({});
        if (iframeRef.current && type === 'lesson' && data.type === 'video') {
            iframeRef.current.src = "";
        }
    };

    const handleStartQuiz = () => {
        if (!activeItem?.data?.questions || activeItem.data.questions.length === 0) {
            alert("No questions available for this quiz yet.");
            return;
        }
        setQuizStarted(true);
        setCurrentQuestionIdx(0);
        setQuizAnswers({});
        setQuizSubmitted(false);
    };

    const handleAnswerQuestion = (qId, answer, type) => {
        setQuizAnswers(prev => {
            if (type === 'multiple_choice') {
                let current = prev[qId] ? [...prev[qId]] : [];
                if (current.includes(answer)) {
                    current = current.filter(a => a !== answer);
                } else {
                    current.push(answer);
                }
                return { ...prev, [qId]: current };
            }
            return { ...prev, [qId]: answer };
        });
    };

    const handleSubmitQuiz = () => {
        let earned = 0;
        let total = 0;
        const questions = activeItem?.data?.questions || [];

        questions.forEach(q => {
            const points = q.points || 10;
            total += points;
            const userAns = quizAnswers[q.id];

            if (q.type === 'multiple_choice') {
                const correctArr = (q.correct_answer || "").split(',').sort().join(',');
                const userArr = (userAns || []).sort().join(',');
                if (correctArr === userArr && correctArr !== "") {
                    earned += points;
                }
            } else {
                if (userAns === q.correct_answer) {
                    earned += points;
                }
            }
        });

        const passedScore = activeItem.data.passing_score || 0;
        const percentage = total > 0 ? (earned / total) * 100 : 0;
        const isPassed = percentage >= passedScore;

        setQuizScore({ earned, total });
        setQuizSubmitted(true);

        api.post(`/instances/${id}/quiz-result`, {
            quiz_id: activeItem.data.id,
            score: earned,
            passed: isPassed
        }).then(() => {
            setProgress(prev => {
                const newQuizzes = prev.quizzes.filter(q => q.quiz_id !== activeItem.data.id);
                newQuizzes.push({ quiz_id: activeItem.data.id, score: earned, passed: isPassed ? 1 : 0 });
                return { ...prev, quizzes: newQuizzes };
            });
        }).catch(console.error);
    };

    const playVideo = (videoUrl) => {
        setVideoPlaying(true);
        if (iframeRef.current) {
            iframeRef.current.src = videoUrl + "?autoplay=1";
        }
    };

    const getContentValue = (content, type) => {
        if (!content) return "";
        try {
            const parsed = typeof content === 'string' ? JSON.parse(content) : content;
            if (type === 'video') return parsed?.videoUrl || content;
            if (type === 'text') return parsed?.html || content;
            return content;
        } catch {
            return content;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">กำลังโหลดข้อมูลบทเรียน...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <p className="text-slate-500 text-lg">{error || "Course not found"}</p>
                <button onClick={() => navigate('/mycourses')} className="px-6 py-2 bg-primary text-white rounded-xl">Back to My Courses</button>
            </div>
        );
    }

    // Helper to extract YouTube ID for thumbnail
    const getYoutubeId = (url) => {
        if (!url) return null;
        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const lessonContentValue = activeItem?.type === 'lesson' ? getContentValue(activeItem.data.content, activeItem.data.type) : "";
    const activeYoutubeId = activeItem?.type === 'lesson' && activeItem?.data?.type === 'video' ? getYoutubeId(lessonContentValue) : null;
    const thumbnailUrl = activeYoutubeId ? `https://img.youtube.com/vi/${activeYoutubeId}/maxresdefault.jpg` : null;

    const completedCount = progress.lessons.length + progress.assignments.length + progress.quizzes.filter(q => q.passed == 1 || q.passed === true).length;
    const progressPercentage = totalItemsCount > 0 ? Math.round((completedCount / totalItemsCount) * 100) : 0;

    return (
        <div className="bg-main bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
            <main className="pt-24 flex-3 flex overflow-hidden relative p-4 gap-4 max-w-7xl mx-auto md:px-6 h-screen">

                {/*  Sidebar  */}
                <aside id="lesson-sidebar"
                    className={`w-72 bg-white rounded-3xl border border-slate-200 flex flex-col h-full overflow-hidden shrink-0 shadow-sm transition-all duration-300 ${!sidebarOpen ? 'hidden' : ''} dark:bg-slate-800 dark:border-slate-700`}>
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2 dark:text-slate-200">
                                <span className="material-symbols-outlined text-lg text-primary">list_alt</span>
                                รายละเอียดบทเรียน
                            </h2>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-primary bg-primary/20">{progressPercentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full bg-primary transition-all duration-500`} style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-1">
                        {course.modules?.map((module, mIdx) => (
                            <div className="module" key={module.id}>
                                <button className={`module-toggle w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-colors ${openModule === mIdx ? 'bg-primary/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                    onClick={() => toggleModule(mIdx)}>
                                    <span className={`material-symbols-outlined text-sm ${openModule === mIdx ? 'text-primary-dark' : 'text-slate-400'}`}>expand_more</span>
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${openModule === mIdx ? 'text-primary-dark' : 'text-slate-500'}`}>
                                        บทที่ {mIdx + 1}: {module.title}
                                    </span>
                                </button>

                                <div className={`module-items mt-1 ml-3 pl-3 border-l-2 border-slate-200 dark:border-slate-600 ${openModule === mIdx ? 'block' : 'hidden'}`}>
                                    {module.lessons?.map((lesson, lIdx) => {
                                        const isActive = activeItem?.type === 'lesson' && activeItem?.data?.id === lesson.id;
                                        const isCompleted = progress.lessons.includes(lesson.id);
                                        return (
                                            <div key={lesson.id}
                                                className={`flex items-center gap-2 pl-4 pr-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${isActive ? 'bg-primary/20 border border-primary/50 text-slate-800 font-semibold dark:text-slate-200' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                                onClick={() => handleItemClick('lesson', lesson, mIdx)}>
                                                <span className={`material-symbols-outlined text-sm ${isActive ? 'text-primary-dark' : 'text-slate-300'} ${isCompleted ? 'text-green-500!' : ''}`}>
                                                    {isCompleted ? 'check_circle' : (lesson.type === 'video' ? 'play_circle' : 'article')}
                                                </span>
                                                <span className="truncate">{lIdx + 1}. {lesson.title}</span>
                                            </div>
                                        );
                                    })}

                                    {module.assignments?.map((assignment, aIdx) => {
                                        const isActive = activeItem?.type === 'assignment' && activeItem?.data?.id === assignment.id;
                                        const isCompleted = progress.assignments.includes(assignment.id);
                                        return (
                                            <div key={assignment.id}
                                                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${isActive ? 'bg-primary/20 border border-primary/50 text-slate-800 font-semibold dark:text-slate-200' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                                onClick={() => handleItemClick('assignment', assignment, mIdx)}>
                                                <span className={`material-symbols-outlined text-sm ${isActive ? 'text-primary-dark' : 'text-slate-300'} ${isCompleted ? 'text-green-500!' : ''}`}>
                                                    {isCompleted ? 'check_circle' : 'assignment'}
                                                </span>
                                                <span className="truncate">งาน: {assignment.title}</span>
                                            </div>
                                        );
                                    })}

                                    {module.quizzes?.map((quiz, qIdx) => {
                                        const isActive = activeItem?.type === 'quiz' && activeItem?.data?.id === quiz.id;
                                        const quizPassed = progress.quizzes.find(q => q.quiz_id === quiz.id && q.passed);
                                        return (
                                            <div key={quiz.id}
                                                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer mt-1 transition-colors ${isActive ? 'bg-primary/20 text-primary-dark border border-primary/50' : 'bg-primary/10 text-primary-dark dark:bg-primary/20'}`}
                                                onClick={() => handleItemClick('quiz', quiz, mIdx)}>
                                                <span className={`material-symbols-outlined text-sm ${quizPassed ? 'text-green-500!' : ''}`}>
                                                    {quizPassed ? 'check_circle' : 'quiz'}
                                                </span>
                                                <span className="truncate">Quiz: {quiz.title}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                        <Link to={`/mycourses`} className="w-full py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm hover:bg-slate-800 transition-all dark:hover:bg-slate-700 block text-center cursor-pointer">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            <span>กลับสู่หน้าคอร์ส</span>
                        </Link>
                    </div>
                </aside>

                {/*  Content Area  */}
                <div id="content-wrapper" className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">

                        {/*  Sticky topbar  */}
                        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-8 py-5 flex items-center gap-4 border-b border-slate-100 dark:bg-slate-900/80 dark:border-slate-700">
                            <button onClick={() => setSidebarOpen(prev => !prev)}
                                className="flex items-center justify-center w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all text-slate-500 shrink-0 shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-xl transition-all duration-300" id="toggle-icon">side_navigation</span>
                            </button>
                            {activeItem ? (
                                <div className="flex-1 flex justify-between items-center">
                                    <div>
                                        <nav className="flex items-center space-x-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                            <span>Module {activeItem.moduleIndex + 1}</span>
                                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                                            <span className="text-primary-dark dark:text-primary-light">
                                                {activeItem.type === 'lesson' ? 'Lesson' : activeItem.type === 'quiz' ? 'Quiz' : 'Assignment'}
                                            </span>
                                        </nav>
                                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight dark:text-slate-100">{activeItem.data.title}</h1>
                                    </div>
                                    {course.owner_id === user?.id && (
                                        <Link to={`/mycourses/${id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold text-xs hover:opacity-90 transition-all">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                            <span>แก้ไขคอร์สนี้</span>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div><h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Select an item</h1></div>
                            )}
                        </div>

                        {/* Body Content based on activeItem */}
                        {activeItem?.type === 'lesson' && activeItem.data.type === 'video' && (
                            <div className="max-w-4xl mx-auto w-full px-8 py-10">
                                <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 aspect-video relative group mb-12 bg-slate-900 cursor-pointer dark:border-slate-700" onClick={() => playVideo(lessonContentValue)}>
                                    {/* Thumbnail */}
                                    <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${videoPlaying ? 'hidden' : ''}`}>
                                        {thumbnailUrl ? (
                                            <img alt="Lesson Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
                                                src={thumbnailUrl} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-5xl text-slate-300">school</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                            <button className="w-20 h-20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl bg-primary/100/90">
                                                <span className="material-symbols-outlined text-5xl">play_circle</span>
                                            </button>
                                            <span className="text-white text-xs font-semibold bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">คลิกเพื่อเล่นวิดีโอ</span>
                                        </div>
                                    </div>
                                    {/* YouTube iframe */}
                                    <iframe ref={iframeRef}
                                        className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${videoPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen>
                                    </iframe>
                                </div>

                                <article>
                                    <header className="mb-10">
                                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 dark:text-slate-100">
                                            {activeItem.data.title}
                                        </h2>
                                        <div className="h-1.5 w-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
                                    </header>
                                </article>

                                {/* Done / Next Button for video lessons */}
                                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                    <button
                                        onClick={handleNextItem}
                                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-pink-100"
                                    >
                                        <span>บทเรียนถัดไป</span>
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeItem?.type === 'lesson' && activeItem.data.type === 'text' && (
                            <div className="max-w-4xl mx-auto w-full px-8 py-10">
                                <article className="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-2xl">
                                    <header className="mb-10">
                                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 dark:text-slate-100">
                                            {activeItem.data.title}
                                        </h2>
                                        <div className="h-1.5 w-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
                                    </header>
                                    <div className="ql-editor p-0!" dangerouslySetInnerHTML={{ __html: lessonContentValue }} />
                                    <style>{`
                                        /* Additional styles to make Quill content look good with Tailwind */
                                        .ql-editor h1 { font-size: 2.25rem !important; font-weight: 800 !important; margin-bottom: 1.5rem !important; }
                                        .ql-editor h2 { font-size: 1.875rem !important; font-weight: 700 !important; margin-bottom: 1.25rem !important; }
                                        .ql-editor h3 { font-size: 1.5rem !important; font-weight: 600 !important; margin-bottom: 1rem !important; }
                                        .ql-editor p { margin-bottom: 1rem !important; }
                                        .dark .ql-editor { color: #e2e8f0; }
                                        /* Fix alignment classes not working due to Tailwind Preflight */
                                        .ql-align-center { text-align: center !important; }
                                        .ql-align-right { text-align: right !important; }
                                        .ql-align-justify { text-align: justify !important; }
                                    `}</style>
                                </article>

                                {/* Done / Next Button for text lessons */}
                                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                    <button
                                        onClick={handleNextItem}
                                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-pink-100"
                                    >
                                        <span>บทเรียนถัดไป</span>
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeItem?.type === 'quiz' && (
                            <div className="max-w-4xl mx-auto w-full px-8 py-10">
                                <div className="bg-indigo-600 p-12 rounded-3xl text-white relative overflow-hidden mb-8">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <span className="material-symbols-outlined text-[120px]">quiz</span>
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <span className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest">Quiz</span>
                                        <h2 className="text-4xl font-black uppercase tracking-tight">{activeItem.data.title}</h2>
                                        <p className="text-white/70 font-medium max-w-xl">
                                            {activeItem.data.description || "ทำแบบทดสอบเพื่อตรวจสอบความรู้ของคุณ"}
                                        </p>
                                        <div className="flex gap-4 text-sm font-bold bg-white/10 w-fit px-4 py-2 rounded-xl">
                                            <span>เกณฑ์ผ่าน: {activeItem.data.passing_score}%</span>
                                            <span>•</span>
                                            <span>คำถาม: {activeItem.data.questions?.length || 0} ข้อ</span>
                                        </div>
                                    </div>
                                </div>

                                {!quizStarted && !quizSubmitted && (
                                    <div className="text-center p-12 bg-slate-50 border border-slate-100 rounded-3xl dark:bg-slate-800/50 dark:border-slate-700">
                                        <button
                                            onClick={handleStartQuiz}
                                            className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-pink-200 dark:shadow-none hover:bg-pink-600 transition-all text-lg cursor-pointer"
                                        >
                                            Start Quiz
                                        </button>
                                    </div>
                                )}

                                {quizStarted && !quizSubmitted && activeItem.data.questions?.length > 0 && (
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-sm">
                                        <div className="mb-6 flex justify-between items-center text-sm font-bold text-slate-500">
                                            <span>คำถามที่ {currentQuestionIdx + 1} จาก {activeItem.data.questions.length}</span>
                                        </div>

                                        {(() => {
                                            const q = activeItem.data.questions[currentQuestionIdx];
                                            let choices = q.choices;
                                            if (typeof choices === 'string') {
                                                try { choices = JSON.parse(choices); } catch (e) { /* ignore */ }
                                            }

                                            return (
                                                <div className="space-y-6">
                                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{q.question}</h3>

                                                    <div className="space-y-3">
                                                        {choices?.map((choice, idx) => (
                                                            <label key={idx} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary transition-all">
                                                                {q.type === 'multiple_choice' ? (
                                                                    <input
                                                                        type="checkbox"
                                                                        className="w-5 h-5 accent-primary"
                                                                        checked={(quizAnswers[q.id] || []).includes(choice)}
                                                                        onChange={() => handleAnswerQuestion(q.id, choice, q.type)}
                                                                    />
                                                                ) : (
                                                                    <input
                                                                        type="radio"
                                                                        name={`q-${q.id}`}
                                                                        className="w-5 h-5 accent-primary"
                                                                        checked={quizAnswers[q.id] === choice}
                                                                        onChange={() => handleAnswerQuestion(q.id, choice, q.type)}
                                                                    />
                                                                )}
                                                                <span className="font-medium text-slate-700 dark:text-slate-300">{choice}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-between">
                                            <button
                                                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                                                disabled={currentQuestionIdx === 0}
                                                className="px-6 py-2 rounded-xl font-bold bg-slate-100 text-slate-500 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300"
                                            >
                                                ย้อนกลับ
                                            </button>

                                            {currentQuestionIdx < activeItem.data.questions.length - 1 ? (
                                                <button
                                                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                                                    className="px-6 py-2 rounded-xl font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90"
                                                >
                                                    ถัดไป
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleSubmitQuiz}
                                                    className="px-8 py-2 rounded-xl font-bold bg-primary text-white shadow-lg hover:bg-pink-600"
                                                >
                                                    ส่งคำตอบ
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {quizSubmitted && (
                                    <div className="text-center p-12 bg-white border border-slate-200 rounded-3xl dark:bg-slate-800 dark:border-slate-700 shadow-sm space-y-6">
                                        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="material-symbols-outlined text-5xl">task_alt</span>
                                        </div>
                                        <h3 className="text-3xl font-black">ส่งคำตอบเรียบร้อย!</h3>
                                        <div className="text-xl font-bold text-slate-600 dark:text-slate-300">
                                            คะแนนของคุณ: <span className="text-primary text-4xl ml-2">{quizScore.earned}</span> / {quizScore.total}
                                        </div>
                                        {((quizScore.earned / quizScore.total) * 100) >= activeItem.data.passing_score ? (
                                            <p className="text-green-500 font-bold bg-green-50 w-fit mx-auto px-4 py-1 rounded-full dark:bg-green-900/30">ผ่านเกณฑ์!</p>
                                        ) : (
                                            <p className="text-red-500 font-bold bg-red-50 w-fit mx-auto px-4 py-1 rounded-full dark:bg-red-900/30">ยังไม่ผ่านเกณฑ์ ลองใหม่อีกครั้ง</p>
                                        )}
                                        <div className="pt-6 flex flex-wrap justify-center gap-3">
                                            <button
                                                onClick={handleStartQuiz}
                                                className="px-8 py-3 rounded-xl font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
                                            >
                                                ทำแบบทดสอบอีกครั้ง
                                            </button>
                                            <button
                                                onClick={handleNextItem}
                                                className="px-8 py-3 rounded-xl font-bold bg-primary text-white shadow-lg shadow-pink-100 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                                            >
                                                <span>บทเรียนถัดไป</span>
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeItem?.type === 'assignment' && (
                            <div className="max-w-4xl mx-auto w-full px-8 py-10">
                                <div className="bg-blue-600 p-12 rounded-3xl text-white relative overflow-hidden mb-8">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <span className="material-symbols-outlined text-[120px]">assignment</span>
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <span className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest">Assignment</span>
                                        <h2 className="text-4xl font-black uppercase tracking-tight">{activeItem.data.title}</h2>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-3xl shadow-sm">
                                    <h4 className="flex items-center gap-2 font-black text-slate-800 dark:text-white border-l-4 border-blue-500 pl-4 mb-6 uppercase text-sm tracking-wider">คำอธิบายงาน</h4>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-10 whitespace-pre-line">
                                        {activeItem.data.description || "ส่งงานของคุณได้ที่นี่ (รายละเอียดเบื้องต้น)"}
                                    </p>
                                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center space-y-4">
                                        <span className="material-symbols-outlined text-4xl text-slate-300">upload_file</span>
                                        <p className="text-sm font-bold text-slate-400">อัปโหลดไฟล์งานของคุณ</p>
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

export default MyDetailCourse;