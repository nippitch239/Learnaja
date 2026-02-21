import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function CourseEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);


    const [newModuleName, setNewModuleName] = useState("");

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

    const handleUpdateBasicInfo = async () => {
        try {
            setSubmitting(true);
            await api.put(`/courses/${id}/edit`, {
                title: course.title,
                description: course.description,
                price: course.price,
                thumbnail_url: course.thumbnail_url,
                category: course.category
            });
            setMessage("Course basic info updated!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error(err);
            setMessage("Error updating course");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddModule = async () => {
        if (!newModuleName) return setMessage("Please enter a module name");
        try {
            await api.post(`/courses/${id}/modules`, {
                title: newModuleName,
                order_index: course.modules?.length || 0
            });
            setNewModuleName("");
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (!confirm("Delete this module and all its content?")) return;
        try {
            await api.delete(`/modules/${moduleId}`);
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddLesson = async (moduleId) => {
        const title = prompt("Enter Lesson Title:");
        if (!title) return;
        const videoUrl = prompt("Enter Video URL (optional):", "");

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
        if (!confirm("Delete this lesson?")) return;
        try {
            await api.delete(`/lessons/${lessonId}`);
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddQuiz = async (moduleId) => {
        const title = prompt("Enter Quiz Title:");
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
        if (!confirm("Delete this quiz?")) return;
        try {
            await api.delete(`/quizzes/${quizId}`);
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddAssignment = async (moduleId) => {
        const title = prompt("Enter Assignment Title:");
        if (!title) return;
        try {
            await api.post(`/modules/${moduleId}/assignments`, {
                title,
                description: "",
                max_score: 100,
                submission_type: 'file_upload'
            });
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (!confirm("Delete this assignment?")) return;
        try {
            await api.delete(`/assignments/${assignmentId}`);
            fetchCourseData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-10 text-center text-xl">Loading course editor...</div>;
    if (!course) return <div className="p-10 text-center text-xl text-red-500">Course not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-900 font-sans">Curriculum Editor</h1>
                <button onClick={() => navigate(-1)} className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    ← Back to Dashboard
                </button>
            </div>

            {message && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center animate-in fade-in duration-300">
                    <span>{message}</span>
                    <button onClick={() => setMessage("")} className="hover:text-blue-900">×</button>
                </div>
            )}

            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-10">
                <h2 className="text-xl font-bold mb-6 text-slate-800 border-l-4 border-primary pl-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider">Course Title</label>
                        <input
                            className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                            type="text"
                            placeholder="Enter course title"
                            value={course.title}
                            onChange={(e) => setCourse({ ...course, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider">Price (THB)</label>
                        <input
                            className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                            type="number"
                            placeholder="0.00"
                            value={course.price}
                            onChange={(e) => setCourse({ ...course, price: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider">Category</label>
                        <input
                            className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                            type="text"
                            placeholder="e.g. Programming, Design, Business"
                            value={course.category || ""}
                            onChange={(e) => setCourse({ ...course, category: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                        <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider">Thumbnail Image URL</label>
                        <input
                            className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={course.thumbnail_url || ""}
                            onChange={(e) => setCourse({ ...course, thumbnail_url: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                        <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider">Description</label>
                        <textarea
                            className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none h-32 transition-all resize-none"
                            placeholder="Tell students about this course..."
                            value={course.description}
                            onChange={(e) => setCourse({ ...course, description: e.target.value })}
                        />
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleUpdateBasicInfo}
                        disabled={submitting}
                        className="bg-primary text-white px-10 py-3 rounded-2xl hover:bg-[#FF9DB8] transition-all font-bold shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95"
                    >
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </section>

            <section>
                <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                    <h2 className="text-2xl font-black text-slate-800 border-l-4 border-slate-800 pl-4">Curriculum Builder</h2>
                    <div className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                        <input
                            className="px-5 py-2 rounded-xl border border-slate-100 outline-none focus:bg-slate-50 transition-all w-64"
                            placeholder="New module title..."
                            value={newModuleName}
                            onChange={(e) => setNewModuleName(e.target.value)}
                        />
                        <button
                            onClick={handleAddModule}
                            className="bg-slate-900 text-white px-6 py-2 rounded-xl hover:bg-slate-700 transition-all font-bold shadow-md"
                        >
                            + Add Module
                        </button>
                    </div>
                </div>

                <div className="space-y-10">
                    {course.modules?.length === 0 && (
                        <div className="p-20 text-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium">
                            No modules found. Create your first module to begin.
                        </div>
                    )}

                    {course.modules?.map((module, mIdx) => (
                        <div key={module.id} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transform transition-all hover:shadow-2xl hover:shadow-slate-200/60">
                            <div className="bg-slate-900 px-8 py-5 flex items-center justify-between">
                                <h3 className="text-xl font-black text-white">
                                    <span className="text-primary mr-3">MOD {mIdx + 1}</span> {module.title}
                                </h3>
                                <button
                                    onClick={() => handleDeleteModule(module.id)}
                                    className="text-red-400 hover:text-red-200 font-bold text-sm bg-red-400/10 px-4 py-2 rounded-full transition-all"
                                >
                                    Remove Module
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-black text-slate-800 text-lg uppercase tracking-wider">Lessons</h4>
                                        <button onClick={() => handleAddLesson(module.id)} className="text-primary font-black hover:text-[#FF9DB8] transition-all">+ Add Lesson</button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {module.lessons?.map(lesson => (
                                            <div key={lesson.id} className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-800 font-bold">{lesson.title}</span>
                                                    {lesson.content?.video_url && (
                                                        <span className="text-xs text-blue-500 font-medium truncate max-w-xs">{lesson.content.video_url}</span>
                                                    )}
                                                </div>
                                                <button onClick={() => handleDeleteLesson(lesson.id)} className="text-slate-300 hover:text-red-500 transition-all bg-white p-2 rounded-xl group-hover:shadow-sm">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-black text-amber-600 text-lg uppercase tracking-wider">Quizzes</h4>
                                        <button onClick={() => handleAddQuiz(module.id)} className="text-amber-500 font-black hover:text-amber-400 transition-all">+ Add Quiz</button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {module.quizzes?.map(quiz => (
                                            <div key={quiz.id} className="group flex items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100 hover:bg-white hover:border-amber-400/30 transition-all shadow-sm hover:shadow-md">
                                                <span className="text-amber-900 font-bold">{quiz.title}</span>
                                                <button onClick={() => handleDeleteQuiz(quiz.id)} className="text-amber-300 hover:text-red-500 transition-all bg-white p-2 rounded-xl group-hover:shadow-sm">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-black text-indigo-600 text-lg uppercase tracking-wider">Assignments</h4>
                                        <button onClick={() => handleAddAssignment(module.id)} className="text-indigo-500 font-black hover:text-indigo-400 transition-all">+ Add Assignment</button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {module.assignments?.map(assignment => (
                                            <div key={assignment.id} className="group flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 hover:bg-white hover:border-indigo-400/30 transition-all shadow-sm hover:shadow-md">
                                                <span className="text-indigo-900 font-bold">{assignment.title}</span>
                                                <button onClick={() => handleDeleteAssignment(assignment.id)} className="text-indigo-300 hover:text-red-500 transition-all bg-white p-2 rounded-xl group-hover:shadow-sm">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default CourseEdit;
