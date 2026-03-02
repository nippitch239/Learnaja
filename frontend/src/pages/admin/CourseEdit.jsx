import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link, NavLink } from "react-router-dom";
import api from "../../services/api";
import "quill/dist/quill.snow.css";

function RichTextEditor({ value, onChange, placeholder = 'เขียนเนื้อหาที่นี่...' }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeCb = useRef(onChange);
  useEffect(() => { onChangeCb.current = onChange; }, [onChange]);

  useEffect(() => {
    if (quillRef.current) return;
    let isCancelled = false;

    import('quill').then(({ default: Quill }) => {
      if (isCancelled || quillRef.current) return;

      if (containerRef.current && containerRef.current.parentNode.querySelector('.ql-toolbar')) return;

      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'blockquote', 'code-block', 'json'],
        ['clean']
      ];

      const q = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              json: function () {
                const jsonInput = window.prompt("วาง JSON วางเนื้อหา (Delta JSON) ที่นี่:");
                if (jsonInput) {
                  try {
                    const data = JSON.parse(jsonInput);

                    if (data && (data.ops || Array.isArray(data))) {
                      const delta = Array.isArray(data) ? { ops: data } : data;
                      this.quill.setContents(delta);
                      return;
                    }

                    const formatted = JSON.stringify(data, null, 2);
                    const range = this.quill.getSelection(true);
                    this.quill.insertText(range.index, formatted, 'code-block', true);
                  } catch (e) {
                    const range = this.quill.getSelection(true);
                    this.quill.insertText(range.index, jsonInput);
                  }
                }
              }
            }
          }
        }
      });

      if (value) q.clipboard.dangerouslyPasteHTML(value);
      q.on('text-change', () => {
        const html = q.getSemanticHTML();
        onChangeCb.current(html === '<p></p>' ? '' : html);
      });
      quillRef.current = q;
    });

    return () => { isCancelled = true; };
  }, []);

  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;
    const current = q.getSemanticHTML();
    const incoming = value || '';

    if (current !== incoming && incoming === '') {
      q.setContents([]); // reset
    }
    else if (current === '' && incoming !== '') {
      q.clipboard.dangerouslyPasteHTML(incoming);
    }
  }, [value]);

<<<<<<< HEAD
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
=======
  return (
    <div className="rich-editor-wrapper border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
      <div ref={containerRef} style={{ minHeight: 180 }} />
      <style>{`
                .rich-editor-wrapper .ql-toolbar { border: none; border-bottom: 1px solid #e2e8f0; background: #f8fafc; border-radius: 0; }
                .dark .rich-editor-wrapper .ql-toolbar { background: #1e293b; border-bottom-color: #334155; }
                .dark .rich-editor-wrapper .ql-toolbar .ql-stroke { stroke: #94a3b8; }
                .dark .rich-editor-wrapper .ql-toolbar .ql-fill { fill: #94a3b8; }
                .dark .rich-editor-wrapper .ql-toolbar .ql-picker-label { color: #94a3b8; }
                .dark .rich-editor-wrapper .ql-toolbar .ql-picker-options { background: #1e293b; color: #e2e8f0; }
                .rich-editor-wrapper .ql-container { border: none; font-size: 14px; }
                .dark .rich-editor-wrapper .ql-container { color: #e2e8f0; }
                .dark .rich-editor-wrapper .ql-editor.ql-blank::before { color: #64748b; }
                .rich-editor-wrapper .ql-editor { min-height: 160px; max-height: 400px; overflow-y: auto; padding: 12px 16px; }
                .ql-json::after { content: "{JSON}"; font-size: 10px; font-weight: 800; vertical-align: middle; color: #64748b; }
                .dark .ql-json::after { color: #94a3b8; }
                .ql-json { width: auto !important; padding: 0 4px !important; }
            `}</style>
    </div>
  );
>>>>>>> b3a39cd48afc53ed6b5a0fc050056a4b31dd7451
}

function CourseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [showAddModule, setShowAddModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const [activeModuleDialog, setActiveModuleDialog] = useState(null);
  const [contentType, setContentType] = useState("video");
  const [contentTitle, setContentTitle] = useState("");
  const [contentBody, setContentBody] = useState("");
  const [contentExtra, setContentExtra] = useState("");

  const [editModuleId, setEditModuleId] = useState(null);
  const [editModuleTitle, setEditModuleTitle] = useState("");

  const [editLessonId, setEditLessonId] = useState(null);
  const [editLessonTitle, setEditLessonTitle] = useState("");
  const [editLessonDuration, setEditLessonDuration] = useState("");
  const [editLessonContent, setEditLessonContent] = useState("");

  const [editQuizId, setEditQuizId] = useState(null);
  const [editQuizTitle, setEditQuizTitle] = useState("");
  const [editQuizPassingScore, setEditQuizPassingScore] = useState("");

  const [activeQuizDialog, setActiveQuizDialog] = useState(null);
  const [questionType, setQuestionType] = useState('single_choice');
  const [questionText, setQuestionText] = useState("");
  const [questionChoices, setQuestionChoices] = useState(['', '', '', '']);
  const [questionCorrect, setQuestionCorrect] = useState("0");
  const [questionPoints, setQuestionPoints] = useState(10);

  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editQuestionType, setEditQuestionType] = useState('single_choice');
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editQuestionChoices, setEditQuestionChoices] = useState(['', '', '', '']);
  const [editQuestionCorrect, setEditQuestionCorrect] = useState("0");
  const [editQuestionPoints, setEditQuestionPoints] = useState(10);

  const [editAssignmentId, setEditAssignmentId] = useState(null);
  const [editAssignmentTitle, setEditAssignmentTitle] = useState("");
  const [editAssignmentDescription, setEditAssignmentDescription] = useState("");

  const [videoFile, setVideoFile] = useState(null);
  const [editVideoFile, setEditVideoFile] = useState(null);
  const [videoSourceType, setVideoSourceType] = useState("url");
  const [editVideoSourceType, setEditVideoSourceType] = useState("url");

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${id}/full`);
      setCourse(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถโหลดข้อมูลคอร์สได้");
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    try {
      setIsSaving(true);
      await api.post(`/courses/${id}/modules`, {
        title: newModuleTitle,
        order_index: (course?.modules?.length || 0) + 1,
      });
      setNewModuleTitle("");
      setShowAddModule(false);
      await loadCourseData();
    } catch (err) {
      alert("ไม่สามารถเพิ่มบทเรียนได้");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("คุณต้องการลบบทเรียนนี้ใช่หรือไม่?")) return;
    try {
      setIsSaving(true);
      await api.delete(`/modules/${moduleId}`);
      await loadCourseData();
    } catch (err) {
      alert("ไม่สามารถลบบทเรียนได้");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("คุณต้องการลบเนื้อหานี้ใช่หรือไม่?")) return;
    try {
      setIsSaving(true);
      await api.delete(`/lessons/${lessonId}`);
      await loadCourseData();
    } catch (err) {
      alert("ไม่สามารถลบเนื้อหาได้");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("คุณต้องการลบแบบทดสอบนี้ใช่หรือไม่?")) return;
    try {
      setIsSaving(true);
      await api.delete(`/quizzes/${quizId}`);
      await loadCourseData();
    } catch (err) {
      alert("ไม่สามารถลบแบบทดสอบได้");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("คุณต้องการลบงานนี้ใช่หรือไม่?")) return;
    try {
      setIsSaving(true);
      await api.delete(`/assignments/${assignmentId}`);
      await loadCourseData();
    } catch (err) {
      alert("ไม่สามารถลบงานได้");
    } finally {
      setIsSaving(false);
    }
  };

  const submitEditModule = async () => {
    if (!editModuleTitle.trim()) return;
    try {
      setIsSaving(true);
      await api.put(`/modules/${editModuleId}`, { title: editModuleTitle });
      setEditModuleId(null);
      await loadCourseData();
    } catch (err) {
      alert("ไม่สามารถแก้ไขบทเรียนได้");
    } finally {
      setIsSaving(false);
    }
  };

  const submitEditLesson = async (type) => {
    if (!editLessonTitle.trim()) return;
    try {
      setIsSaving(true);
      let finalContent = {};

      if (type === "video") {
        if (editVideoSourceType === "file" && editVideoFile) {
          const formData = new FormData();
          formData.append("video", editVideoFile);
          const uploadRes = await api.post("/upload-video", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          finalContent = { videoUrl: uploadRes.data.videoPath };
        } else {
          finalContent = { videoUrl: editLessonContent };
        }
      } else if (type === "text") {
        finalContent = { html: editLessonContent };
      }

      await api.put(`/lessons/${editLessonId}`, {
        title: editLessonTitle,
        duration_minutes: parseInt(editLessonDuration) || 0,
        content: finalContent,
      });
      setEditLessonId(null);
      setEditVideoFile(null);
      setEditVideoSourceType("url");
      setError(null);
      await loadCourseData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "ไม่สามารถแก้ไขเนื้อหาได้";
      setError(msg);
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const submitEditQuiz = async () => {
    if (!editQuizTitle.trim()) return;
    try {
      setIsSaving(true);
      await api.put(`/quizzes/${editQuizId}`, {
        title: editQuizTitle,
        passing_score: parseInt(editQuizPassingScore) || 0,
      });
      setEditQuizId(null);
      await loadCourseData();
    } catch (err) {
      alert("ไม่สามารถแก้ไขแบบทดสอบได้");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = async (quizId) => {
    if (!questionText.trim()) return alert("กรุณากรอกคำถาม");

    try {
      setIsSaving(true);
      let payload = {
        question: questionText,
        type: questionType,
        points: parseInt(questionPoints) || 10
      };

      if (questionType === 'true_false') {
        payload.choices = ['True', 'False'];
        payload.correct_answer = questionCorrect;
      } else {
        const filteredChoices = questionChoices.filter(c => c.trim() !== "");
        if (filteredChoices.length < 2) return alert("กรุณากรอกตัวเลือกอย่างน้อย 2 ข้อ");
        payload.choices = filteredChoices;

        if (questionType === 'multiple_choice') {
          if (!questionCorrect) return alert("กรุณาเลือกคำตอบที่ถูกต้อง");
          payload.correct_answer = questionCorrect;
        } else {
          if (!questionCorrect) return alert("กรุณาเลือกคำตอบที่ถูกต้อง");
          payload.correct_answer = payload.choices[parseInt(questionCorrect)];
        }
      }

      if (questionType === 'single_choice') {
        payload.correct_answer = payload.choices[parseInt(questionCorrect)];
      } else if (questionType === 'multiple_choice') {
        const correctIndices = questionCorrect.split(',').filter(i => i !== "");
        payload.correct_answer = correctIndices.map(i => payload.choices[parseInt(i)]).join(',');
      }

      await api.post(`/quizzes/${quizId}/questions`, payload);

      setActiveQuizDialog(null);
      setQuestionText("");
      setQuestionChoices(['', '', '', '']);
      setQuestionCorrect("0");
      await loadCourseData();
    } catch (err) {
      alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มคำถาม");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("คุณต้องการลบคำถามนี้ใช่หรือไม่?")) return;
    try {
      setIsSaving(true);
      await api.delete(`/questions/${questionId}`);
      await loadCourseData();
    } catch (err) {
      alert("ไม่สามารถลบคำถามได้");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditQuestion = (q) => {
    setEditQuestionId(q.id);
    setEditQuestionText(q.question);
    setEditQuestionType(q.type || 'single_choice');
    setEditQuestionPoints(q.points || 10);
    try {
      let choices = q.choices;
      if (typeof choices === 'string') choices = JSON.parse(choices);
      setEditQuestionChoices(Array.isArray(choices) && choices.length > 0 ? choices : ['', '', '', '']);
    } catch { setEditQuestionChoices(['', '', '', '']); }
    try {
      let choices = q.choices;
      if (typeof choices === 'string') choices = JSON.parse(choices);
      const ca = q.correct_answer || '';
      if (q.type === 'true_false') {
        setEditQuestionCorrect(ca);
      } else if (q.type === 'multiple_choice') {
        const caTexts = ca.split(',').map(t => t.trim());
        const indexes = caTexts.map(t => choices.indexOf(t)).filter(i => i !== -1);
        setEditQuestionCorrect(indexes.join(','));
      } else {
        const idx = choices.indexOf(ca);
        setEditQuestionCorrect(idx >= 0 ? idx.toString() : '0');
      }
    } catch { setEditQuestionCorrect('0'); }
  };

  const submitEditQuestion = async () => {
    if (!editQuestionText.trim()) return alert("กรุณากรอกคำถาม");
    try {
      setIsSaving(true);
      let payload = {
        question: editQuestionText,
        type: editQuestionType,
        points: parseInt(editQuestionPoints) || 10
      };

      if (editQuestionType === 'true_false') {
        payload.choices = ['True', 'False'];
        payload.correct_answer = editQuestionCorrect;
      } else {
        const filteredChoices = editQuestionChoices.filter(c => c.trim() !== '');
        if (filteredChoices.length < 2) return alert("กรุณากรอกตัวเลือกอย่างน้อย 2 ข้อ");
        payload.choices = filteredChoices;
        if (editQuestionType === 'multiple_choice') {
          if (!editQuestionCorrect) return alert("กรุณาเลือกคำตอบที่ถูกต้อง");
          const correctIndices = editQuestionCorrect.split(',').filter(i => i !== '');
          payload.correct_answer = correctIndices.map(i => filteredChoices[parseInt(i)]).join(',');
        } else {
          if (editQuestionCorrect === '') return alert("กรุณาเลือกคำตอบที่ถูกต้อง");
          payload.correct_answer = filteredChoices[parseInt(editQuestionCorrect)];
        }
      }

      await api.put(`/questions/${editQuestionId}`, payload);
      setEditQuestionId(null);
      await loadCourseData();
    } catch (err) {
      alert(err.response?.data?.message || "ไม่สามารถแก้ไขคำถามได้");
    } finally {
      setIsSaving(false);
    }
  };

  const submitEditAssignment = async () => {
    if (!editAssignmentTitle.trim()) return;
    try {
      setIsSaving(true);
      await api.put(`/assignments/${editAssignmentId}`, {
        title: editAssignmentTitle,
        description: editAssignmentDescription,
      });
      setEditAssignmentId(null);
      await loadCourseData();
    } catch (err) {
      alert("ไม่สามารถแก้ไขงานได้");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveModule = async (index, direction) => {
    if (!course?.modules) return;
    const newModules = [...course.modules];
    if (direction === "up" && index > 0) {
      [newModules[index], newModules[index - 1]] = [newModules[index - 1], newModules[index]];
    } else if (direction === "down" && index < newModules.length - 1) {
      [newModules[index], newModules[index + 1]] = [newModules[index + 1], newModules[index]];
    } else {
      return;
    }

    setCourse((prev) => ({ ...prev, modules: newModules }));

    try {
      setIsSaving(true);
      const order = newModules.map((m) => m.id);
      await api.post(`/courses/${id}/modules/reorder`, { order });
    } catch (err) {
      alert("ไม่สามารถเปลี่ยนลำดับบทเรียนได้");
      await loadCourseData();
    } finally {
      setIsSaving(false);
    }
  };

  const getSortedModuleItems = (module) => {
    const items = [
      ...(module.lessons || []).map((l) => ({ ...l, itemType: "lesson" })),
      ...(module.quizzes || []).map((q) => ({ ...q, itemType: "quiz" })),
      ...(module.assignments || []).map((a) => ({ ...a, itemType: "assignment" })),
    ];
    return items.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  };

  const handleMoveItem = async (moduleId, itemType, itemId, direction) => {
    const module = course.modules.find((m) => m.id === moduleId);
    if (!module) return;

    const items = getSortedModuleItems(module);
    const index = items.findIndex((item) => item.itemType === itemType && item.id === itemId);

    if (direction === "up" && index > 0) {
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
    } else if (direction === "down" && index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    } else {
      return;
    }

    try {
      setIsSaving(true);
      const order = items.map((item) => ({ type: item.itemType, id: item.id }));
      await api.post(`/modules/${moduleId}/items/reorder`, { order });
      await loadCourseData();
    } catch (err) {
      alert("ไม่สามารถเปลี่ยนลำดับได้");
    } finally {
      setIsSaving(false);
    }
  };

  const resetContentForm = () => {
    setContentType("video");
    setContentTitle("");
    setContentBody("");
    setContentExtra("");
    setVideoFile(null);
    setVideoSourceType("url");
  };

  const handleAddContent = async (moduleId) => {
    if (!contentTitle.trim()) return alert("กรุณากรอกชื่อเรื่อง");

    try {
      setIsSaving(true);
      let finalContent = {};

      if (contentType === "video") {
        if (videoSourceType === "file" && videoFile) {
          const formData = new FormData();
          formData.append("video", videoFile);
          const uploadRes = await api.post("/upload-video", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          finalContent = { videoUrl: uploadRes.data.videoPath };
        } else {
          finalContent = { videoUrl: contentBody };
        }
      } else if (contentType === "text") {
        finalContent = { html: contentBody };
      } else if (contentType === "quiz") {
        finalContent = { passing_score: parseInt(contentExtra) || 70 };
      }

      const mod = course.modules.find((m) => m.id === moduleId);
      const items = getSortedModuleItems(mod);
      const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.order_index || 0)) + 1 : 1;

      if (contentType === "quiz") {
        await api.post(`/modules/${moduleId}/quizzes`, {
          title: contentTitle,
          passing_score: finalContent.passing_score,
          order_index: nextOrder,
        });
      } else if (contentType === "assignment") {
        await api.post(`/modules/${moduleId}/assignments`, {
          title: contentTitle,
          description: contentBody,
          order_index: nextOrder,
        });
      } else {
        await api.post(`/modules/${moduleId}/lessons`, {
          title: contentTitle,
          type: contentType,
          content: finalContent,
          duration_minutes: parseInt(contentExtra) || 0,
          order_index: nextOrder,
        });
      }

      resetContentForm();
      setActiveModuleDialog(null);
      setError(null);
      await loadCourseData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มเนื้อหา";
      setError(msg);
      alert(msg);
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

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
        <div className="text-center space-y-4">
          <p>ไม่พบคอร์สที่ต้องการแก้ไข</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl bg-primary text-white font-bold shadow hover:brightness-105"
          >
            กลับไปหน้าเดิม
          </button>
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
            {/* Curriculum */}
            <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold">โครงสร้างบทเรียนของคอร์สหลัก</h2>
                  <p className="text-slate-400 text-sm">
                    ปรับแต่งบทเรียนหลักที่ใช้เป็นต้นแบบให้กับทุกอินสแตนซ์ (อินสแตนซ์ที่ปรับแต่งแล้วจะไม่ถูกกระทบ)
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModule((v) => !v)}
                  className="bg-primary text-white px-4 py-2 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                  disabled={isSaving}
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  เพิ่มบทเรียนใหม่
                </button>
              </div>

              <div className="p-6 space-y-6">
                {showAddModule && (
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center">
                    <input
                      type="text"
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      placeholder="ชื่อบทเรียนใหม่ เช่น บทที่ 1: แนะนำคอร์ส"
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAddModule(false)}
                        className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs font-bold"
                      >
                        ยกเลิก
                      </button>
                      <button
                        onClick={handleAddModule}
                        disabled={isSaving}
                        className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold"
                      >
                        บันทึกบทเรียน
                      </button>
                    </div>
                  </div>
                )}

                {course.modules?.length === 0 && (
                  <div className="text-center text-slate-400 text-sm py-8">
                    ยังไม่มีบทเรียนในคอร์สนี้ คลิกปุ่ม &quot;เพิ่มบทเรียนใหม่&quot; เพื่อเริ่มต้น
                  </div>
                )}

                {course.modules?.map((module, mIdx) => (
                  <div key={module.id} className="space-y-4">
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-3 w-full">
                        <div className="flex flex-col items-center gap-1 mr-1">
                          <button
                            onClick={() => handleMoveModule(mIdx, "up")}
                            className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30"
                            disabled={mIdx === 0 || isSaving}
                          >
                            <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                          </button>
                          <button
                            onClick={() => handleMoveModule(mIdx, "down")}
                            className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30"
                            disabled={mIdx === course.modules.length - 1 || isSaving}
                          >
                            <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                          </button>
                        </div>
                        {editModuleId === module.id ? (
                          <div className="flex-1 flex gap-2 w-full pr-4">
                            <input
                              type="text"
                              value={editModuleTitle}
                              onChange={(e) => setEditModuleTitle(e.target.value)}
                              className="w-full p-1.5 bg-white dark:bg-slate-800 border-b-2 border-primary outline-none font-bold dark:text-white"
                              autoFocus
                            />
                            <button
                              onClick={submitEditModule}
                              disabled={isSaving}
                              className="text-xs font-bold bg-primary text-white px-3 rounded-lg flex items-center shrink-0"
                            >
                              บันทึก
                            </button>
                            <button
                              onClick={() => setEditModuleId(null)}
                              className="text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 rounded-lg flex items-center shrink-0"
                            >
                              ยกเลิก
                            </button>
                          </div>
                        ) : (
                          <h3 className="font-bold text-lg">
                            บทที่ {mIdx + 1}: {module.title}
                          </h3>
                        )}
                      </div>
                      {editModuleId !== module.id && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleDeleteModule(module.id)}
                            className="text-red-500 font-bold text-sm hover:underline"
                            disabled={isSaving}
                          >
                            ลบบทนี้
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={() => {
                              setEditModuleId(module.id);
                              setEditModuleTitle(module.title);
                            }}
                            className="text-primary font-bold text-sm hover:underline"
                          >
                            แก้ไขชื่อ
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-6">
                      {getSortedModuleItems(module).map((item, itemIdx) => (
                        <div key={`${item.itemType}-${item.id}`}>
                          {item.itemType === "lesson" ? (
                            <div className="flex flex-col p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
                              {editLessonId === item.id ? (
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={editLessonTitle}
                                    onChange={(e) => setEditLessonTitle(e.target.value)}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 font-bold text-sm rounded-lg"
                                    placeholder="ชื่อเนื้อหา"
                                    autoFocus
                                  />
                                  {item.type === "video" ? (
                                    <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                      <div className="flex gap-2 mb-2">
                                        <button
                                          onClick={() => setEditVideoSourceType("url")}
                                          className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${editVideoSourceType === "url"
                                              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                              : "bg-slate-200 text-slate-500"
                                            }`}
                                        >
                                          ใช้ URL
                                        </button>
                                        <button
                                          onClick={() => setEditVideoSourceType("file")}
                                          className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${editVideoSourceType === "file"
                                              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                              : "bg-slate-200 text-slate-500"
                                            }`}
                                        >
                                          อัปโหลดไฟล์
                                        </button>
                                      </div>

                                      {editVideoSourceType === "url" ? (
                                        <input
                                          type="text"
                                          value={editLessonContent}
                                          onChange={(e) => setEditLessonContent(e.target.value)}
                                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 text-xs rounded-lg"
                                          placeholder="YouTube URL หรือไฟล์ URL"
                                        />
                                      ) : (
                                        <div className="space-y-2">
                                          <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => setEditVideoFile(e.target.files[0])}
                                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 text-xs rounded-lg"
                                          />
                                          {item.content?.videoUrl?.startsWith("/uploads/") && (
                                            <p className="text-[10px] text-slate-500 italic px-1">
                                              ไฟล์ปัจจุบัน: {item.content.videoUrl}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                      <input
                                        type="number"
                                        value={editLessonDuration}
                                        onChange={(e) => setEditLessonDuration(e.target.value)}
                                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 text-xs rounded-lg"
                                        placeholder="ความยาว (นาที)"
                                      />
                                      {error && (
                                        <div className="text-red-500 text-[10px] font-bold mt-1 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-900/30 flex items-center gap-1">
                                          <span className="material-symbols-outlined text-sm">error</span>
                                          {error}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <RichTextEditor
                                      value={editLessonContent}
                                      onChange={setEditLessonContent}
                                      placeholder="เขียนเนื้อหาบทเรียน..."
                                    />
                                  )}
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => setEditLessonId(null)}
                                      className="px-3 py-1 bg-slate-200 text-xs font-bold rounded-lg dark:text-slate-800"
                                    >
                                      ยกเลิก
                                    </button>
                                    <button
                                      onClick={() => submitEditLesson(item.type)}
                                      disabled={isSaving}
                                      className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg"
                                    >
                                      บันทึกเนื้อหา
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex flex-col items-center gap-1 mr-1">
                                      <button
                                        onClick={() => handleMoveItem(module.id, "lesson", item.id, "up")}
                                        className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30"
                                        disabled={itemIdx === 0 || isSaving}
                                      >
                                        <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                                      </button>
                                      <button
                                        onClick={() => handleMoveItem(module.id, "lesson", item.id, "down")}
                                        className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30"
                                        disabled={itemIdx === getSortedModuleItems(module).length - 1 || isSaving}
                                      >
                                        <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                                      </button>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300">
                                      {item.type === "video" ? "play_circle" : "article"}
                                    </span>
                                    <div>
                                      <p className="font-semibold text-slate-700 dark:text-slate-200">{item.title}</p>
                                      <p className="text-xs text-slate-400">
                                        {item.type === "video" ? "วิดีโอ" : "ข้อความ"}{" "}
                                        {item.duration_minutes > 0 ? `• ${item.duration_minutes} นาที` : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <button
                                      onClick={() => handleDeleteLesson(item.id)}
                                      className="text-slate-300 hover:text-red-500 transition-colors"
                                      disabled={isSaving}
                                    >
                                      <span className="material-symbols-outlined">delete</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditLessonId(item.id);
                                        setEditLessonTitle(item.title);
                                        setEditLessonDuration(item.duration_minutes || "");
                                        setError(null);
                                        try {
                                          let contentObj = item.content;
                                          if (typeof contentObj === "string") contentObj = JSON.parse(contentObj);
                                          setEditLessonContent(
                                            item.type === "video"
                                              ? contentObj?.videoUrl || ""
                                              : contentObj?.html || ""
                                          );
                                        } catch {
                                          setEditLessonContent("");
                                        }
                                      }}
                                      className="material-symbols-outlined text-slate-300 hover:text-slate-500 transition-colors"
                                    >
                                      edit
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : item.itemType === "quiz" ? (
                            <div className="space-y-2">
                              <div className="flex flex-col p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
                                {editQuizId === item.id ? (
                                  <div className="space-y-3">
                                    <input
                                      type="text"
                                      value={editQuizTitle}
                                      onChange={(e) => setEditQuizTitle(e.target.value)}
                                      className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 font-bold text-sm rounded-lg"
                                      placeholder="ชื่อแบบทดสอบ"
                                      autoFocus
                                    />
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-slate-500">เกณฑ์ผ่าน:</span>
                                      <input
                                        type="number"
                                        value={editQuizPassingScore}
                                        onChange={(e) => setEditQuizPassingScore(e.target.value)}
                                        className="w-20 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 text-xs rounded-lg text-center"
                                        placeholder="%"
                                      />
                                      <span className="text-xs font-bold text-slate-500">%</span>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                      <button onClick={() => setEditQuizId(null)} className="px-3 py-1 bg-slate-200 text-xs font-bold rounded-lg dark:text-slate-800">ยกเลิก</button>
                                      <button onClick={submitEditQuiz} disabled={isSaving} className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-lg hover:bg-purple-600">บันทึกแบบทดสอบ</button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <div className="flex flex-col items-center gap-1 mr-1">
                                        <button onClick={() => handleMoveItem(module.id, "quiz", item.id, "up")} className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30" disabled={itemIdx === 0 || isSaving}>
                                          <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                                        </button>
                                        <button onClick={() => handleMoveItem(module.id, "quiz", item.id, "down")} className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30" disabled={itemIdx === getSortedModuleItems(module).length - 1 || isSaving}>
                                          <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                                        </button>
                                      </div>
                                      <span className="material-symbols-outlined text-purple-400">quiz</span>
                                      <div>
                                        <p className="font-semibold text-slate-700 dark:text-slate-200">แบบทดสอบ: {item.title}</p>
                                        <p className="text-xs text-slate-400">เกณฑ์ผ่าน: {item.passing_score}% | {item.questions?.length || 0} คำถาม</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                      <button onClick={() => { setActiveQuizDialog(item.id); setQuestionType('single_choice'); setQuestionText(''); setQuestionChoices(['', '', '', '']); setQuestionCorrect('0'); }} className="text-slate-400 hover:text-primary transition-colors text-xs font-bold">+ เพิ่มคำถาม</button>
                                      <button onClick={() => { setEditQuizId(item.id); setEditQuizTitle(item.title); setEditQuizPassingScore(item.passing_score); }} className="material-symbols-outlined text-slate-300 hover:text-slate-500 transition-colors">edit</button>
                                      <button onClick={() => handleDeleteQuiz(item.id)} className="text-slate-300 hover:text-red-500 transition-colors" disabled={isSaving}>
                                        <span className="material-symbols-outlined">delete</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Questions List */}
                              {item.questions?.length > 0 && (
                                <div className="pl-12 space-y-2">
                                  {item.questions.map((q, qSubIdx) => (
                                    <div key={q.id} className="bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-800/50">
                                      {editQuestionId === q.id ? (
                                        <div className="p-4 space-y-3">
                                          <div className="flex flex-wrap gap-2">
                                            {['single_choice', 'multiple_choice', 'true_false'].map(t => (
                                              <button key={t} onClick={() => { setEditQuestionType(t); setEditQuestionCorrect(t === 'true_false' ? 'True' : t === 'multiple_choice' ? '' : '0'); }} className={`px-3 py-1 rounded-full text-xs font-bold ${editQuestionType === t ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                                {t === 'single_choice' ? 'Single Choice' : t === 'multiple_choice' ? 'Multiple Choice' : 'True / False'}
                                              </button>
                                            ))}
                                          </div>
                                          <textarea value={editQuestionText} onChange={e => setEditQuestionText(e.target.value)} placeholder="คำถาม..." className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm" autoFocus />
                                          {editQuestionType !== 'true_false' && (
                                            <div className="space-y-2">
                                              <p className="text-xs font-bold text-slate-500">ตัวเลือก (อย่างน้อย 2)</p>
                                              {editQuestionChoices.map((choice, cIdx) => (
                                                <div key={cIdx} className="flex items-center gap-2">
                                                  {editQuestionType === 'single_choice' ? (
                                                    <input type="radio" name={`eq-correct-${q.id}`} checked={editQuestionCorrect === cIdx.toString()} onChange={() => setEditQuestionCorrect(cIdx.toString())} />
                                                  ) : (
                                                    <input type="checkbox" checked={editQuestionCorrect.split(',').includes(cIdx.toString())} onChange={e => {
                                                      let cur = editQuestionCorrect ? editQuestionCorrect.split(',') : [];
                                                      if (e.target.checked) cur.push(cIdx.toString());
                                                      else cur = cur.filter(i => i !== cIdx.toString());
                                                      setEditQuestionCorrect(cur.join(','));
                                                    }} />
                                                  )}
                                                  <input type="text" value={choice} onChange={e => { const n = [...editQuestionChoices]; n[cIdx] = e.target.value; setEditQuestionChoices(n); }} placeholder={`ตัวเลือกที่ ${cIdx + 1}`} className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                                  {editQuestionChoices.length > 2 && (
                                                    <button onClick={() => { const n = [...editQuestionChoices]; n.splice(cIdx, 1); setEditQuestionChoices(n); }} className="text-red-400 hover:text-red-600">
                                                      <span className="material-symbols-outlined text-sm">close</span>
                                                    </button>
                                                  )}
                                                </div>
                                              ))}
                                              <button onClick={() => setEditQuestionChoices([...editQuestionChoices, ''])} className="text-xs text-primary font-bold">+ เพิ่มตัวเลือก</button>
                                            </div>
                                          )}
                                          {editQuestionType === 'true_false' && (
                                            <div className="flex gap-4">
                                              <label className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 cursor-pointer">
                                                <input type="radio" name={`eq-tf-${q.id}`} checked={editQuestionCorrect === 'True'} onChange={() => setEditQuestionCorrect('True')} /> True (ถูก)
                                              </label>
                                              <label className="flex items-center gap-2 text-sm bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200 cursor-pointer">
                                                <input type="radio" name={`eq-tf-${q.id}`} checked={editQuestionCorrect === 'False'} onChange={() => setEditQuestionCorrect('False')} /> False (ผิด)
                                              </label>
                                            </div>
                                          )}
                                          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-bold text-slate-500">คะแนน:</span>
                                              <input type="number" value={editQuestionPoints} onChange={e => setEditQuestionPoints(e.target.value)} className="w-16 p-1 border rounded text-xs text-center dark:bg-slate-800 dark:border-slate-700" />
                                            </div>
                                            <div className="flex gap-2">
                                              <button onClick={() => setEditQuestionId(null)} className="px-3 py-1.5 text-slate-500 text-xs font-bold">ยกเลิก</button>
                                              <button onClick={submitEditQuestion} disabled={isSaving} className="px-4 py-1.5 bg-purple-500 text-white text-xs rounded-lg font-bold hover:bg-purple-600">{isSaving ? 'บันทึก...' : 'บันทึกคำถาม'}</button>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex justify-between items-start p-3">
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{qSubIdx + 1}. {q.question}</p>
                                            <p className="text-xs text-slate-500 mt-1">ชนิด: {q.type} | เฉลย: {q.correct_answer} | {q.points} คะแนน</p>
                                            {q.type !== 'true_false' && (() => {
                                              try {
                                                let cs = q.choices;
                                                if (typeof cs === 'string') cs = JSON.parse(cs);
                                                return Array.isArray(cs) && cs.length > 0 ? (
                                                  <div className="mt-1.5 flex flex-wrap gap-1">
                                                    {cs.map((c, ci) => (
                                                      <span key={ci} className={`text-[11px] px-2 py-0.5 rounded-full border ${q.correct_answer?.includes(c) ? 'bg-green-50 border-green-300 text-green-700 font-bold' : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}>{c}</span>
                                                    ))}
                                                  </div>
                                                ) : null;
                                              } catch { return null; }
                                            })()}
                                          </div>
                                          <div className="flex items-center gap-1 ml-2 shrink-0">
                                            <button onClick={() => handleEditQuestion(q)} className="text-slate-300 hover:text-purple-500 transition-colors" title="แก้ไขคำถาม"><span className="material-symbols-outlined text-sm">edit</span></button>
                                            <button onClick={() => handleDeleteQuestion(q.id)} className="text-slate-300 hover:text-red-500 transition-colors" title="ลบคำถาม"><span className="material-symbols-outlined text-sm">delete</span></button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Add Question Dialog */}
                              {activeQuizDialog === item.id && (
                                <div className="ml-12 p-4 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-purple-200 dark:border-purple-900/50 space-y-4">
                                  <div className="flex gap-2">
                                    <button onClick={() => { setQuestionType('single_choice'); setQuestionCorrect('0'); }} className={`px-3 py-1 rounded-full text-xs font-bold ${questionType === 'single_choice' ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>Single Choice (1 คำตอบ)</button>
                                    <button onClick={() => { setQuestionType('multiple_choice'); setQuestionCorrect(''); }} className={`px-3 py-1 rounded-full text-xs font-bold ${questionType === 'multiple_choice' ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>Multiple Choice (หลายคำตอบ)</button>
                                    <button onClick={() => { setQuestionType('true_false'); setQuestionCorrect('True'); }} className={`px-3 py-1 rounded-full text-xs font-bold ${questionType === 'true_false' ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>True/False (ถูก/ผิด)</button>
                                  </div>

                                  <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="คำถาม..." className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm"></textarea>

                                  {questionType !== 'true_false' && (
                                    <div className="space-y-2">
                                      <p className="text-xs font-bold text-slate-500">ตัวเลือก (อย่างน้อย 2)</p>
                                      {questionChoices.map((choice, cIdx) => (
                                        <div key={cIdx} className="flex items-center gap-2">
                                          {questionType === 'single_choice' ? (
                                            <input type="radio" name={`correct-${item.id}`} checked={questionCorrect === cIdx.toString()} onChange={() => setQuestionCorrect(cIdx.toString())} />
                                          ) : (
                                            <input type="checkbox" checked={questionCorrect.split(',').includes(cIdx.toString())} onChange={(e) => {
                                              let current = questionCorrect ? questionCorrect.split(',') : [];
                                              if (e.target.checked) current.push(cIdx.toString());
                                              else current = current.filter(i => i !== cIdx.toString());
                                              setQuestionCorrect(current.join(','));
                                            }} />
                                          )}
                                          <input type="text" value={choice} onChange={(e) => { const newChoices = [...questionChoices]; newChoices[cIdx] = e.target.value; setQuestionChoices(newChoices); }} placeholder={`ตัวเลือกที่ ${cIdx + 1}`} className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm" />
                                        </div>
                                      ))}
                                      <button onClick={() => setQuestionChoices([...questionChoices, ""])} className="text-xs text-primary font-bold">+ เพิ่มตัวเลือก</button>
                                    </div>
                                  )}

                                  {questionType === 'true_false' && (
                                    <div className="flex gap-4">
                                      <label className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 cursor-pointer">
                                        <input type="radio" name={`tf-${item.id}`} checked={questionCorrect === 'True'} onChange={() => setQuestionCorrect('True')} /> True (ถูก)
                                      </label>
                                      <label className="flex items-center gap-2 text-sm bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200 cursor-pointer">
                                        <input type="radio" name={`tf-${item.id}`} checked={questionCorrect === 'False'} onChange={() => setQuestionCorrect('False')} /> False (ผิด)
                                      </label>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-slate-500">คะแนน:</span>
                                      <input type="number" value={questionPoints} onChange={(e) => setQuestionPoints(e.target.value)} className="w-16 p-1 border rounded text-xs text-center dark:bg-slate-800 dark:border-slate-700" />
                                    </div>
                                    <div className="flex gap-2">
                                      <button onClick={() => setActiveQuizDialog(null)} className="px-3 py-1.5 text-slate-500 text-xs font-bold">ยกเลิก</button>
                                      <button onClick={() => handleAddQuestion(item.id)} disabled={isSaving} className="px-4 py-1.5 bg-purple-500 text-white text-xs rounded-lg font-bold">ยืนยันเพิ่มคำถาม</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
                              {editAssignmentId === item.id ? (
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={editAssignmentTitle}
                                    onChange={(e) => setEditAssignmentTitle(e.target.value)}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 font-bold text-sm rounded-lg"
                                    placeholder="ชื่องาน"
                                    autoFocus
                                  />
                                  <textarea
                                    value={editAssignmentDescription}
                                    onChange={(e) => setEditAssignmentDescription(e.target.value)}
                                    rows={3}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 text-xs rounded-lg"
                                    placeholder="รายละเอียดงาน"
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => setEditAssignmentId(null)}
                                      className="px-3 py-1 bg-slate-200 text-xs font-bold rounded-lg dark:text-slate-800"
                                    >
                                      ยกเลิก
                                    </button>
                                    <button
                                      onClick={submitEditAssignment}
                                      disabled={isSaving}
                                      className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600"
                                    >
                                      บันทึกงาน
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex flex-col items-center gap-1 mr-1">
                                      <button
                                        onClick={() => handleMoveItem(module.id, "assignment", item.id, "up")}
                                        className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30"
                                        disabled={itemIdx === 0 || isSaving}
                                      >
                                        <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                                      </button>
                                      <button
                                        onClick={() => handleMoveItem(module.id, "assignment", item.id, "down")}
                                        className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30"
                                        disabled={itemIdx === getSortedModuleItems(module).length - 1 || isSaving}
                                      >
                                        <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                                      </button>
                                    </div>
                                    <span className="material-symbols-outlined text-amber-400">assignment</span>
                                    <div>
                                      <p className="font-semibold text-slate-700 dark:text-slate-200">
                                        งาน: {item.title}
                                      </p>
                                      <p className="text-xs text-slate-400">
                                        {item.max_score ? `คะแนนเต็ม ${item.max_score}` : "ไม่มีคะแนนกำหนด"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <button
                                      onClick={() => {
                                        setEditAssignmentId(item.id);
                                        setEditAssignmentTitle(item.title);
                                        setEditAssignmentDescription(item.description || "");
                                      }}
                                      className="material-symbols-outlined text-slate-300 hover:text-slate-500 transition-colors"
                                    >
                                      edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAssignment(item.id)}
                                      className="text-slate-300 hover:text-red-500 transition-colors"
                                      disabled={isSaving}
                                    >
                                      <span className="material-symbols-outlined">delete</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add content */}
                      <div className="mt-3">
                        {activeModuleDialog === module.id ? (
                          <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                            <div className="flex flex-wrap gap-2 text-xs font-bold">
                              <button
                                onClick={() => setContentType("video")}
                                className={`px-3 py-1 rounded-full ${contentType === "video"
                                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                    : "bg-slate-200 dark:bg-slate-800 text-slate-600"
                                  }`}
                              >
                                วิดีโอ
                              </button>
                              <button
                                onClick={() => setContentType("text")}
                                className={`px-3 py-1 rounded-full ${contentType === "text"
                                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                    : "bg-slate-200 dark:bg-slate-800 text-slate-600"
                                  }`}
                              >
                                ข้อความ
                              </button>
                              <button
                                onClick={() => setContentType("quiz")}
                                className={`px-3 py-1 rounded-full ${contentType === "quiz"
                                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                    : "bg-slate-200 dark:bg-slate-800 text-slate-600"
                                  }`}
                              >
                                แบบทดสอบ
                              </button>
                              <button
                                onClick={() => setContentType("assignment")}
                                className={`px-3 py-1 rounded-full ${contentType === "assignment"
                                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                    : "bg-slate-200 dark:bg-slate-800 text-slate-600"
                                  }`}
                              >
                                งาน
                              </button>
                            </div>

                            <input
                              type="text"
                              value={contentTitle}
                              onChange={(e) => setContentTitle(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                              placeholder="ชื่อเนื้อหา / แบบทดสอบ / งาน"
                            />

                            {contentType === "video" && (
                              <div className="space-y-3">
                                <div className="flex gap-2 mb-2">
                                  <button
                                    onClick={() => setVideoSourceType("url")}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${videoSourceType === "url"
                                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                        : "bg-slate-200 text-slate-500"
                                      }`}
                                  >
                                    ใช้ URL
                                  </button>
                                  <button
                                    onClick={() => setVideoSourceType("file")}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${videoSourceType === "file"
                                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                        : "bg-slate-200 text-slate-500"
                                      }`}
                                  >
                                    อัปโหลดไฟล์
                                  </button>
                                </div>
                                {videoSourceType === "url" ? (
                                  <input
                                    type="text"
                                    value={contentBody}
                                    onChange={(e) => setContentBody(e.target.value)}
                                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 text-xs rounded-lg"
                                    placeholder="YouTube URL หรือไฟล์ URL"
                                  />
                                ) : (
                                  <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setVideoFile(e.target.files[0])}
                                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 text-xs rounded-lg"
                                  />
                                )}
                                <input
                                  type="number"
                                  value={contentExtra}
                                  onChange={(e) => setContentExtra(e.target.value)}
                                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 text-xs rounded-lg"
                                  placeholder="ความยาว (นาที)"
                                />
                              </div>
                            )}

                            {contentType === "text" && (
                              <RichTextEditor
                                value={contentBody}
                                onChange={setContentBody}
                                placeholder="เขียนเนื้อหาบทเรียน..."
                              />
                            )}

                            {contentType === "quiz" && (
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500">เกณฑ์ผ่าน (%)</label>
                                <input
                                  type="number"
                                  value={contentExtra}
                                  onChange={(e) => setContentExtra(e.target.value)}
                                  className="w-24 p-2 bg-white dark:bg-slate-900 border border-slate-200 text-xs rounded-lg"
                                  placeholder="70"
                                />
                              </div>
                            )}

                            {contentType === "assignment" && (
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500">รายละเอียดงาน</label>
                                <textarea
                                  value={contentBody}
                                  onChange={(e) => setContentBody(e.target.value)}
                                  rows={3}
                                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 text-xs rounded-lg"
                                  placeholder="อธิบายรายละเอียดงานที่ต้องส่ง"
                                />
                              </div>
                            )}

                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                onClick={() => {
                                  setActiveModuleDialog(null);
                                  resetContentForm();
                                }}
                                className="px-3 py-1 bg-slate-200 text-xs font-bold rounded-lg dark:text-slate-800"
                              >
                                ยกเลิก
                              </button>
                              <button
                                onClick={() => handleAddContent(module.id)}
                                disabled={isSaving}
                                className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg"
                              >
                                เพิ่มเนื้อหา
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveModuleDialog(module.id);
                              resetContentForm();
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-1"
                          >
                            <span className="material-symbols-outlined text-sm">add_circle</span>
                            เพิ่มเนื้อหาในบทนี้
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourseEdit;