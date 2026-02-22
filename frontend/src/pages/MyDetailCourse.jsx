import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInstance, fetchCourseFull } from "../services/fetchCourse";
import { AuthContext } from "../context/AuthContext";

function MyDetailCourse() {
    const [instance, setInstance] = useState(null);
    const [fullCourse, setFullCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const loadData = async () => {
            try {
                const instanceData = await fetchInstance(id);
                setInstance(instanceData);

                const courseData = await fetchCourseFull(instanceData.template_id);
                setFullCourse(courseData);

                if (courseData.modules?.[0]?.lessons?.[0]) {
                    setActiveLesson(courseData.modules[0].lessons[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) return <div className="p-10 text-center text-xl">Loading course content...</div>;
    if (!instance) return <div className="p-10 text-center text-xl text-red-500">Course Instance not found</div>;

    const isTeacher = user?.roles?.includes('teacher');

    return (
        <div className="container mx-auto px-4 my-8">
            <div className="flex flex-wrap justify-between items-start mb-10 gap-6">
                <div className="flex gap-6 items-center">
                    {fullCourse?.thumbnail_url && (
                        <img
                            src={fullCourse.thumbnail_url}
                            alt={instance.title}
                            className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white"
                        />
                    )}
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white">{instance.title}</h1>
                        <p className="text-slate-500 mt-2 font-medium">{instance.description}</p>
                        <div className="flex gap-3 mt-4">
                            <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">
                                Role: {instance.role}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all cursor-pointer font-bold shadow-sm"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                    {instance.role === 'owner' && isTeacher && (
                        <button
                            className="bg-primary text-white px-6 py-3 rounded-2xl hover:bg-[#FF9DB8] cursor-pointer transition-all font-bold shadow-lg shadow-primary/20"
                            onClick={() => navigate(`/mycourses/${instance.id}/invite`)}
                        >
                            Invite Students
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    {activeLesson ? (
                        <div className="space-y-6">
                            <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative border-4 border-white dark:border-slate-800">
                                {activeLesson.content?.video_url ? (
                                    <iframe
                                        className="w-full h-full"
                                        src={activeLesson.content.video_url.includes('youtube.com') || activeLesson.content.video_url.includes('youtu.be')
                                            ? activeLesson.content.video_url.replace('watch?v=', 'embed/')
                                            : activeLesson.content.video_url}
                                        title={activeLesson.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                                        <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                                        <p className="font-bold text-lg">No video available for this lesson</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
                                <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{activeLesson.title}</h2>
                                <div className="flex items-center gap-4 mt-4 text-slate-400 font-bold text-sm">
                                    <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg uppercase">{activeLesson.type}</span>
                                    <span>•</span>
                                    <span>{activeLesson.duration_minutes} Minutes</span>
                                </div>
                                {activeLesson.content?.transcript && (
                                    <div className="mt-8">
                                        <h4 className="font-black text-slate-800 dark:text-white border-l-4 border-primary pl-4 mb-4">Lesson Transcript</h4>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{activeLesson.content.transcript}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800/50 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex items-center justify-center">
                            <p className="text-slate-400 font-bold italic text-lg">Select a lesson to start learning</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white px-2">Course Curriculum</h3>

                    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                        {(!fullCourse?.modules || fullCourse.modules.length === 0) ? (
                            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-400 italic">Curriculum is empty.</p>
                            </div>
                        ) : (
                            fullCourse.modules.map((module, mIdx) => (
                                <div key={module.id} className="space-y-3">
                                    <h4 className="font-black text-slate-400 text-xs uppercase tracking-[0.2em] px-2 mb-2">Module {mIdx + 1}: {module.title}</h4>
                                    <div className="space-y-2">
                                        {module.lessons?.map((lesson) => (
                                            <button
                                                key={lesson.id}
                                                onClick={() => setActiveLesson(lesson)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left border-2 ${activeLesson?.id === lesson.id
                                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105 z-10'
                                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-primary/30'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${activeLesson?.id === lesson.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'
                                                    }`}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm block truncate w-full">{lesson.title}</p>
                                                    <p className={`text-[10px] font-bold uppercase mt-0.5 ${activeLesson?.id === lesson.id ? 'text-white/70' : 'text-slate-400'}`}>
                                                        {lesson.duration_minutes} Mins • {lesson.type}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}

                                        {module.quizzes?.map(quiz => (
                                            <div key={quiz.id} className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border-2 border-amber-100 dark:border-amber-900/20 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-amber-200/50 flex items-center justify-center text-amber-700">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-amber-800 dark:text-amber-500 text-sm">Quiz: {quiz.title}</p>
                                                    <p className="text-[10px] font-bold text-amber-600 uppercase mt-0.5">Passing: {quiz.passing_score}%</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyDetailCourse;
