import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useParams, Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import Swal from "sweetalert2";
import 'quill/dist/quill.snow.css';


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
}

function EditInstanceCurriculum() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [showAddModule, setShowAddModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");

    const [activeModuleDialog, setActiveModuleDialog] = useState(null);
    const [contentType, setContentType] = useState('video');
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

    const [editAssignmentId, setEditAssignmentId] = useState(null);
    const [editAssignmentTitle, setEditAssignmentTitle] = useState("");
    const [editAssignmentDescription, setEditAssignmentDescription] = useState("");

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

    const [videoFile, setVideoFile] = useState(null);
    const [editVideoFile, setEditVideoFile] = useState(null);
    const [videoSourceType, setVideoSourceType] = useState('url'); // 'url' or 'file'
    const [editVideoSourceType, setEditVideoSourceType] = useState('url');

    const [dragIdx, setDragIdx] = useState(null);
    const [dragOverIdx, setDragOverIdx] = useState(null);
    const [canDragModule, setCanDragModule] = useState(false);

    useEffect(() => {
        loadInstanceData();
    }, [id]);

    const loadInstanceData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/instances/${id}/full`);
            if (res.data.modules) {
                res.data.modules.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
            }
            setInstance(res.data);
        } catch (err) {
            console.error(err);
            setError("ไม่สามารถโหลดข้อมูลคอร์สได้");
        } finally {
            setLoading(false);
        }
    };

    const handleCustomize = async () => {
        const result = await Swal.fire({
            title: "เริ่มปรับแต่งหลักสูตร?",
            text: "คุณต้องการปรับแต่งคอร์สนี้ใช่หรือไม่? ระบบจะคัดลอกบทเรียนทั้งหมดเพื่อความสะดวกในการแก้ไข โดยไม่กระทบกับหลักสูตรหลัก",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "ปรับแต่งเลย",
            cancelButtonText: "ยกเลิก"
        });
        if (!result.isConfirmed) return;
        try {
            setIsSaving(true);
            await api.post(`/instances/${id}/customize`);
            await loadInstanceData();
            Swal.fire({ title: "สำเร็จ", text: "ปรับแต่งคอร์สเรียบร้อยแล้ว! คุณสามารถแก้ไขบทเรียนได้ทันที", icon: "success", timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire("ข้อผิดพลาด", err.response?.data?.message || "เกิดข้อผิดพลาดในการปรับแต่ง", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddModule = async () => {
        if (!newModuleTitle.trim()) return;
        try {
            setIsSaving(true);
            await api.post(`/instances/${id}/modules`, {
                title: newModuleTitle,
                order_index: instance.modules?.length > 0 ? Math.max(...instance.modules.map(m => m.order_index || 0)) + 1 : 1
            });
            setNewModuleTitle("");
            setShowAddModule(false);
            await loadInstanceData();
        } catch (err) {
            alert("ไม่สามารถเพิ่มบทเรียนได้");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        const result = await Swal.fire({ title: "คุณต้องการลบบทเรียนนี้ใช่หรือไม่?", icon: "warning", showCancelButton: true, confirmButtonText: "ตกลง", cancelButtonText: "ยกเลิก" });
        if (!result.isConfirmed) return;
        try {
            setIsSaving(true);
            await api.delete(`/modules/${moduleId}`);
            await loadInstanceData();
            Swal.fire({ title: "สำเร็จ", text: "ลบสำเร็จ", icon: "success", timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire("ข้อผิดพลาด", "ไม่สามารถลบได้ เนื่องจากบทเรียนนี้อาจเป็นส่วนหนึ่งของเทมเพลตหลัก คุณจำเป็นต้อง 'เริ่มปรับแต่ง' ก่อนหากต้องการลบ", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        const result = await Swal.fire({ title: "คุณต้องการลบเนื้อหานี้ใช่หรือไม่?", icon: "warning", showCancelButton: true, confirmButtonText: "ตกลง", cancelButtonText: "ยกเลิก" });
        if (!result.isConfirmed) return;
        try {
            setIsSaving(true);
            await api.delete(`/lessons/${lessonId}`);
            await loadInstanceData();
            Swal.fire({ title: "สำเร็จ", text: "ลบสำเร็จ", icon: "success", timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire("ข้อผิดพลาด", "ไม่สามารถลบเนื้อหาได้", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        const result = await Swal.fire({ title: "คุณต้องการลบแบบทดสอบนี้ใช่หรือไม่?", icon: "warning", showCancelButton: true, confirmButtonText: "ตกลง", cancelButtonText: "ยกเลิก" });
        if (!result.isConfirmed) return;
        try {
            setIsSaving(true);
            await api.delete(`/quizzes/${quizId}`);
            await loadInstanceData();
            Swal.fire({ title: "สำเร็จ", text: "ลบสำเร็จ", icon: "success", timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire("ข้อผิดพลาด", "ไม่สามารถลบแบบทดสอบได้", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        const result = await Swal.fire({ title: "คุณต้องการลบงานนี้ใช่หรือไม่?", icon: "warning", showCancelButton: true, confirmButtonText: "ตกลง", cancelButtonText: "ยกเลิก" });
        if (!result.isConfirmed) return;
        try {
            setIsSaving(true);
            await api.delete(`/assignments/${assignmentId}`);
            await loadInstanceData();
            Swal.fire({ title: "สำเร็จ", text: "ลบสำเร็จ", icon: "success", timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire("ข้อผิดพลาด", "ไม่สามารถลบงานได้", "error");
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
                description: editAssignmentDescription
            });
            setEditAssignmentId(null);
            await loadInstanceData();
        } catch (err) {
            alert("ไม่สามารถแก้ไขงานได้");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddContent = async (moduleId) => {
        if (!contentTitle.trim()) return alert("กรุณากรอกชื่อเรื่อง");

        try {
            setIsSaving(true);
            let finalContent = {};

            if (contentType === 'video') {
                if (videoSourceType === 'file' && videoFile) {
                    const formData = new FormData();
                    formData.append('video', videoFile);
                    const uploadRes = await api.post('/upload-video', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    finalContent = { videoUrl: uploadRes.data.videoPath };
                } else {
                    finalContent = { videoUrl: contentBody };
                }
            } else if (contentType === 'text') {
                finalContent = { html: contentBody };
            } else if (contentType === 'quiz') {
                finalContent = { passing_score: parseInt(contentExtra) || 70 };
            }

            const mod = instance.modules.find(m => m.id === moduleId);
            const items = getSortedModuleItems(mod);
            const nextOrder = items.length > 0 ? Math.max(...items.map(i => i.order_index || 0)) + 1 : 1;

            if (contentType === 'quiz') {
                await api.post(`/modules/${moduleId}/quizzes`, {
                    title: contentTitle,
                    passing_score: finalContent.passing_score,
                    order_index: nextOrder
                });
            } else {
                await api.post(`/modules/${moduleId}/lessons`, {
                    title: contentTitle,
                    type: contentType,
                    content: finalContent,
                    duration_minutes: parseInt(contentExtra) || 0,
                    order_index: nextOrder
                });
            }

            setContentTitle("");
            setContentBody("");
            setContentExtra("");
            setVideoFile(null);
            setVideoSourceType('url');
            setActiveModuleDialog(null);
            setError(null);
            await loadInstanceData();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มเนื้อหา";
            setError(msg);
            alert(msg);
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
            await loadInstanceData();
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

            if (type === 'video') {
                if (editVideoSourceType === 'file' && editVideoFile) {
                    const formData = new FormData();
                    formData.append('video', editVideoFile);
                    const uploadRes = await api.post('/upload-video', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    finalContent = { videoUrl: uploadRes.data.videoPath };
                } else {
                    finalContent = { videoUrl: editLessonContent };
                }
            } else if (type === 'text') {
                finalContent = { html: editLessonContent };
            }

            await api.put(`/lessons/${editLessonId}`, {
                title: editLessonTitle,
                duration_minutes: parseInt(editLessonDuration) || 0,
                content: finalContent
            });
            setEditLessonId(null);
            setEditVideoFile(null);
            setEditVideoSourceType('url');
            setError(null);
            await loadInstanceData();
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
                passing_score: parseInt(editQuizPassingScore) || 0
            });
            setEditQuizId(null);
            await loadInstanceData();
        } catch (err) {
            alert("ไม่สามารถแก้ไขแบบทดสอบได้");
        } finally {
            setIsSaving(false);
        }
    };

    const handleMoveModule = async (index, direction) => {
        const newModules = [...instance.modules];
        if (direction === 'up' && index > 0) {
            [newModules[index], newModules[index - 1]] = [newModules[index - 1], newModules[index]];
        } else if (direction === 'down' && index < newModules.length - 1) {
            [newModules[index], newModules[index + 1]] = [newModules[index + 1], newModules[index]];
        } else {
            return;
        }

        try {
            setIsSaving(true);
            const order = newModules.map(m => m.id);
            await api.post(`/instances/${id}/modules/reorder`, { order });
            await loadInstanceData();
        } catch (err) {
            alert("ไม่สามารถเปลี่ยนลำดับบทเรียนได้");
        } finally {
            setIsSaving(false);
        }
    };

    const getSortedModuleItems = (module) => {
        const items = [
            ...(module.lessons || []).map(l => ({ ...l, itemType: 'lesson' })),
            ...(module.quizzes || []).map(q => ({ ...q, itemType: 'quiz' }))
        ];
        return items.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    };

    const handleMoveItem = async (moduleId, itemType, itemId, direction) => {
        const module = instance.modules.find(m => m.id === moduleId);
        if (!module) return;

        const items = getSortedModuleItems(module);
        const index = items.findIndex(item => item.itemType === itemType && item.id === itemId);

        if (direction === 'up' && index > 0) {
            [items[index], items[index - 1]] = [items[index - 1], items[index]];
        } else if (direction === 'down' && index < items.length - 1) {
            [items[index], items[index + 1]] = [items[index + 1], items[index]];
        } else {
            return;
        }

        try {
            setIsSaving(true);
            const order = items.map(item => ({ type: item.itemType, id: item.id }));
            await api.post(`/modules/${moduleId}/items/reorder`, { order });
            await loadInstanceData();
        } catch (err) {
            alert("ไม่สามารถเปลี่ยนลำดับได้");
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
                    // single choice
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
            await loadInstanceData();
        } catch (err) {
            alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มคำถาม");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        const result = await Swal.fire({ title: "คุณต้องการลบคำถามนี้ใช่หรือไม่?", icon: "warning", showCancelButton: true, confirmButtonText: "ตกลง", cancelButtonText: "ยกเลิก" });
        if (!result.isConfirmed) return;
        try {
            setIsSaving(true);
            await api.delete(`/questions/${questionId}`);
            await loadInstanceData();
            Swal.fire({ title: "สำเร็จ", text: "ลบคำถามสำเร็จ", icon: "success", timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire("ข้อผิดพลาด", "ไม่สามารถลบคำถามได้", "error");
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
            await loadInstanceData();
        } catch (err) {
            alert(err.response?.data?.message || "ไม่สามารถแก้ไขคำถามได้");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDragStart = (e, idx) => {
        setDragIdx(idx);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, idx) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (idx !== dragOverIdx) setDragOverIdx(idx);
    };

    const handleDrop = async (e, dropIdx) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === dropIdx) {
            setDragIdx(null);
            setDragOverIdx(null);
            return;
        }

        const newModules = [...instance.modules];
        const [moved] = newModules.splice(dragIdx, 1);
        newModules.splice(dropIdx, 0, moved);
        setInstance(prev => ({ ...prev, modules: newModules }));
        setDragIdx(null);
        setDragOverIdx(null);

        try {
            await api.post(`/instances/${id}/modules/reorder`, {
                order: newModules.map(m => m.id)
            });
        } catch (err) {
            alert('ไม่สามารถบันทึกลำดับบทเรียนได้');
            await loadInstanceData();
        }
    };

    const handleDragEnd = () => {
        setDragIdx(null);
        setDragOverIdx(null);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        </div>
    );

    const isCustomized = instance.is_customized === 1;

    return (
        <div className="bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-300 min-h-screen">
            <main className="pt-28 pb-12 max-w-7xl mx-auto px-4 lg:px-6">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 sticky top-28">
                            <nav className="space-y-1">
                                <div className="px-4 py-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">การจัดการ</div>

                                <NavLink
                                    to={`/mycourses/${id}/edit/info`}
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
                                    to={`/mycourses/${id}/edit`}
                                    end
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

                                <NavLink
                                    to={`/mycourses/${id}/invite`}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`
                                    }
                                >
                                    <span className="material-symbols-outlined">group</span>
                                    <span>จัดการนักเรียน</span>
                                </NavLink>

                                {instance.owner_id === user.id && user.roles.includes("teacher") && (
                                    <NavLink
                                        to={`/mycourses/${id}/progress`}
                                        className={({ isActive }) =>
                                            `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            }`
                                        }
                                    >
                                        <span className="material-symbols-outlined">insights</span>
                                        <span>ดูความคืบหน้านักเรียน</span>
                                    </NavLink>
                                )}

                                <NavLink
                                    to={`/mycourses/${id}/view`}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`
                                    }
                                >
                                    <span className="material-symbols-outlined">visibility</span>
                                    <span>ดูตัวอย่างหน้าคอร์ส</span>
                                </NavLink>

                            </nav>
                            <div className="mt-6">
                                <Link to={`/mycourses/${id}/view`}>
                                    <button className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-xl font-bold hover:opacity-90 cursor-pointer transition-opacity flex items-center space-x-2 w-full justify-center text-sm shadow-sm">
                                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                                        <span>กลับไปหน้าคอร์ส</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Content  */}
                    <div className="flex-1">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold">แก้ไขเนื้อหาคอร์สเรียน</h1>
                                    <p className="text-slate-400 text-sm ">ปรับแต่งบทเรียนตามความต้องการของคุณ (ไม่กระทบหลักสูตรหลัก)</p>
                                </div>
                                {!isCustomized && (
                                    <button
                                        onClick={handleCustomize}
                                        className="bg-primary text-white px-4 py-2 rounded-xl cursor-pointer font-bold hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                                        disabled={isSaving}
                                    >
                                        <span className="material-symbols-outlined text-lg">content_copy</span>
                                        {isSaving ? "กำลังดำเนินการ..." : "เริ่มปรับแต่งจากหลักสูตรหลัก"}
                                    </button>
                                )}
                            </div>

                            <div className="p-6 space-y-8 relative">
                                {/* Lock overlay when not customized */}
                                {!isCustomized && (
                                    <div className="absolute inset-0 z-10 rounded-b-2xl flex flex-col items-center justify-center gap-3"
                                        style={{ background: 'rgba(255,255,255,0.7)', cursor: 'not-allowed', backdropFilter: 'blur(2px)' }}>
                                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg px-8 py-6 flex flex-col items-center gap-3 border border-slate-100 dark:border-slate-700 pointer-events-none">
                                            <span className="material-symbols-outlined text-5xl text-slate-300">lock</span>
                                            <p className="font-bold text-slate-600 dark:text-slate-300 text-center">กรุณากด "เริ่มปรับแต่งจากหลักสูตรหลัก" ก่อน</p>
                                            <p className="text-xs text-slate-400 text-center">เพื่อเริ่มแก้ไขเนื้อหาคอร์สนี้</p>
                                        </div>
                                    </div>
                                )}
                                {instance.modules?.map((module, mIdx) => (
                                    <div
                                        className={`space-y-4 transition-all duration-200 ${dragOverIdx === mIdx && dragIdx !== mIdx
                                            ? 'ring-2 ring-primary ring-offset-2 rounded-xl'
                                            : ''
                                            } ${dragIdx === mIdx ? 'opacity-40' : ''}`}
                                        key={module.id}
                                        draggable={canDragModule}
                                        onDragStart={e => handleDragStart(e, mIdx)}
                                        onDragOver={e => handleDragOver(e, mIdx)}
                                        onDrop={e => handleDrop(e, mIdx)}
                                        onDragEnd={(e) => {
                                            handleDragEnd(e);
                                            setCanDragModule(false);
                                        }}
                                    >
                                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center space-x-3 w-full">
                                                <div className="flex flex-col items-center gap-1 mr-1">
                                                    <button onClick={() => handleMoveModule(mIdx, 'up')} className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30" disabled={mIdx === 0 || isSaving}>
                                                        <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                                                    </button>
                                                    <button onClick={() => handleMoveModule(mIdx, 'down')} className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30" disabled={mIdx === instance.modules.length - 1 || isSaving}>
                                                        <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                                                    </button>
                                                </div>
                                                <span
                                                    className="material-symbols-outlined text-slate-400 cursor-grab active:cursor-grabbing select-none"
                                                    title="ลากเพื่อเปลี่ยนลำดับ"
                                                    onMouseEnter={() => setCanDragModule(true)}
                                                    onMouseLeave={() => setCanDragModule(false)}
                                                >drag_indicator</span>
                                                {editModuleId === module.id ? (
                                                    <div className="flex-1 flex gap-2 w-full pr-4">
                                                        <input type="text" value={editModuleTitle} onChange={(e) => setEditModuleTitle(e.target.value)} className="w-full p-1.5 bg-white dark:bg-slate-800 border-b-2 border-primary outline-none focus:border-pink-600 font-bold dark:text-white" autoFocus />
                                                        <button onClick={submitEditModule} disabled={isSaving} className="text-xs font-bold bg-primary text-white px-3 rounded-lg flex items-center shrink-0">บันทึก</button>
                                                        <button onClick={() => setEditModuleId(null)} className="text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 rounded-lg flex items-center shrink-0">ยกเลิก</button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h3 className="font-bold text-lg">บทที่ {mIdx + 1}: {module.title}</h3>
                                                        {module.instance_id && (
                                                            <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase">ปรับแต่งแล้ว</span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            {editModuleId !== module.id && (
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button onClick={() => handleDeleteModule(module.id)} className="text-red-500 font-bold text-sm hover:underline" disabled={isSaving}>ลบบทนี้</button>
                                                    <span className="text-slate-300">|</span>
                                                    <button onClick={() => { setEditModuleId(module.id); setEditModuleTitle(module.title); }} className="text-primary font-bold text-sm hover:underline">แก้ไขชื่อ</button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-6">
                                            {getSortedModuleItems(module).map((item, itemIdx) => (
                                                <div key={`${item.itemType}-${item.id}`}>
                                                    {item.itemType === 'lesson' ? (
                                                        <div className="flex flex-col p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
                                                            {editLessonId === item.id ? (
                                                                <div className="space-y-3">
                                                                    <input type="text" value={editLessonTitle} onChange={(e) => setEditLessonTitle(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 font-bold text-sm rounded-lg" placeholder="ชื่อเนื้อหา" autoFocus />
                                                                    {item.type === 'video' ? (
                                                                        <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                                                            <div className="flex gap-2 mb-2">
                                                                                <button onClick={() => setEditVideoSourceType('url')} className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${editVideoSourceType === 'url' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-200 text-slate-500'}`}>ใช้ URL</button>
                                                                                <button onClick={() => setEditVideoSourceType('file')} className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${editVideoSourceType === 'file' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-200 text-slate-500'}`}>อัปโหลดไฟล์</button>
                                                                            </div>

                                                                            {editVideoSourceType === 'url' ? (
                                                                                <input type="text" value={editLessonContent} onChange={(e) => setEditLessonContent(e.target.value)} className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 text-xs rounded-lg" placeholder="YouTube URL หรือไฟล์ URL" />
                                                                            ) : (
                                                                                <div className="space-y-2">
                                                                                    <input type="file" accept="video/*" onChange={(e) => setEditVideoFile(e.target.files[0])} className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 text-xs rounded-lg" />
                                                                                    {item.content?.videoUrl?.startsWith('/uploads/') && (
                                                                                        <p className="text-[10px] text-slate-500 italic px-1">ไฟล์ปัจจุบัน: {item.content.videoUrl}</p>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            <input type="number" value={editLessonDuration} onChange={(e) => setEditLessonDuration(e.target.value)} className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 text-xs rounded-lg" placeholder="ความยาว (นาที)" />
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
                                                                        <button onClick={() => setEditLessonId(null)} className="px-3 py-1 bg-slate-200 text-xs font-bold rounded-lg dark:text-slate-800">ยกเลิก</button>
                                                                        <button onClick={() => submitEditLesson(item.type)} disabled={isSaving} className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg">บันทึกเนื้อหา</button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="flex flex-col items-center gap-1 mr-1">
                                                                            <button onClick={() => handleMoveItem(module.id, 'lesson', item.id, 'up')} className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30" disabled={itemIdx === 0 || isSaving}>
                                                                                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                                                                            </button>
                                                                            <button onClick={() => handleMoveItem(module.id, 'lesson', item.id, 'down')} className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30" disabled={itemIdx === getSortedModuleItems(module).length - 1 || isSaving}>
                                                                                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                                                                            </button>
                                                                        </div>
                                                                        <span className="material-symbols-outlined text-slate-300">
                                                                            {item.type === 'video' ? 'play_circle' : 'article'}
                                                                        </span>
                                                                        <div>
                                                                            <p className="font-semibold text-slate-700 dark:text-slate-200">
                                                                                {item.title}
                                                                            </p>
                                                                            <p className="text-xs text-slate-400">{item.type === 'video' ? 'วิดีโอ' : 'ข้อความ'} {item.duration_minutes > 0 ? `• ${item.duration_minutes} นาที` : ''}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center space-x-4">
                                                                        <button onClick={() => handleDeleteLesson(item.id)} className="text-slate-300 hover:text-red-500 transition-colors" disabled={isSaving}>
                                                                            <span className="material-symbols-outlined">delete</span>
                                                                        </button>
                                                                        <button onClick={() => {
                                                                            setEditLessonId(item.id);
                                                                            setEditLessonTitle(item.title);
                                                                            setEditLessonDuration(item.duration_minutes || "");
                                                                            setError(null);
                                                                            try {
                                                                                let contentObj = item.content;
                                                                                if (typeof contentObj === 'string') contentObj = JSON.parse(contentObj);
                                                                                setEditLessonContent(item.type === 'video' ? (contentObj?.videoUrl || "") : (contentObj?.html || ""));
                                                                            } catch { setEditLessonContent(""); }
                                                                        }} className="material-symbols-outlined text-slate-300 hover:text-slate-500 transition-colors">edit</button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <div className="flex flex-col p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
                                                                {editQuizId === item.id ? (
                                                                    <div className="space-y-3">
                                                                        <input type="text" value={editQuizTitle} onChange={(e) => setEditQuizTitle(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 font-bold text-sm rounded-lg" placeholder="ชื่อแบบทดสอบ" autoFocus />
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs font-bold text-slate-500">เกณฑ์ผ่าน:</span>
                                                                            <input type="number" value={editQuizPassingScore} onChange={(e) => setEditQuizPassingScore(e.target.value)} className="w-20 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 text-xs rounded-lg text-center" placeholder="%" />
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
                                                                                <button onClick={() => handleMoveItem(module.id, 'quiz', item.id, 'up')} className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30" disabled={itemIdx === 0 || isSaving}>
                                                                                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                                                                                </button>
                                                                                <button onClick={() => handleMoveItem(module.id, 'quiz', item.id, 'down')} className="text-slate-300 hover:text-primary transition-colors disabled:opacity-30" disabled={itemIdx === getSortedModuleItems(module).length - 1 || isSaving}>
                                                                                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                                                                                </button>
                                                                            </div>
                                                                            <span className="material-symbols-outlined text-purple-400">quiz</span>
                                                                            <div>
                                                                                <p className="font-semibold text-slate-700 dark:text-slate-200">
                                                                                    แบบทดสอบ: {item.title}
                                                                                </p>
                                                                                <p className="text-xs text-slate-400">เกณฑ์ผ่าน: {item.passing_score}% | {item.questions?.length || 0} คำถาม</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center space-x-4">
                                                                            <button
                                                                                onClick={() => {
                                                                                    setActiveQuizDialog(item.id);
                                                                                    setQuestionType('single_choice');
                                                                                    setQuestionText('');
                                                                                    setQuestionChoices(['', '', '', '']);
                                                                                    setQuestionCorrect('0');
                                                                                }}
                                                                                className="text-slate-400 hover:text-primary transition-colors text-xs font-bold"
                                                                            >
                                                                                + เพิ่มคำถาม
                                                                            </button>
                                                                            <button onClick={() => {
                                                                                setEditQuizId(item.id);
                                                                                setEditQuizTitle(item.title);
                                                                                setEditQuizPassingScore(item.passing_score);
                                                                            }} className="material-symbols-outlined text-slate-300 hover:text-slate-500 transition-colors">edit</button>
                                                                            <button
                                                                                onClick={() => handleDeleteQuiz(item.id)}
                                                                                className="text-slate-300 hover:text-red-500 transition-colors"
                                                                                disabled={isSaving}
                                                                            >
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
                                                                                /* ── Edit Question Form ── */
                                                                                <div className="p-4 space-y-3">
                                                                                    <div className="flex flex-wrap gap-2">
                                                                                        {['single_choice', 'multiple_choice', 'true_false'].map(t => (
                                                                                            <button key={t} onClick={() => { setEditQuestionType(t); setEditQuestionCorrect(t === 'true_false' ? 'True' : t === 'multiple_choice' ? '' : '0'); }}
                                                                                                className={`px-3 py-1 rounded-full text-xs font-bold ${editQuestionType === t ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                                                                                {t === 'single_choice' ? 'Single Choice' : t === 'multiple_choice' ? 'Multiple Choice' : 'True / False'}
                                                                                            </button>
                                                                                        ))}
                                                                                    </div>
                                                                                    <textarea
                                                                                        value={editQuestionText}
                                                                                        onChange={e => setEditQuestionText(e.target.value)}
                                                                                        placeholder="คำถาม..."
                                                                                        className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm"
                                                                                        autoFocus
                                                                                    />
                                                                                    {editQuestionType !== 'true_false' && (
                                                                                        <div className="space-y-2">
                                                                                            <p className="text-xs font-bold text-slate-500">ตัวเลือก (อย่างน้อย 2)</p>
                                                                                            {editQuestionChoices.map((choice, cIdx) => (
                                                                                                <div key={cIdx} className="flex items-center gap-2">
                                                                                                    {editQuestionType === 'single_choice' ? (
                                                                                                        <input type="radio" name={`eq-correct-${q.id}`}
                                                                                                            checked={editQuestionCorrect === cIdx.toString()}
                                                                                                            onChange={() => setEditQuestionCorrect(cIdx.toString())} />
                                                                                                    ) : (
                                                                                                        <input type="checkbox"
                                                                                                            checked={editQuestionCorrect.split(',').includes(cIdx.toString())}
                                                                                                            onChange={e => {
                                                                                                                let cur = editQuestionCorrect ? editQuestionCorrect.split(',') : [];
                                                                                                                if (e.target.checked) cur.push(cIdx.toString());
                                                                                                                else cur = cur.filter(i => i !== cIdx.toString());
                                                                                                                setEditQuestionCorrect(cur.join(','));
                                                                                                            }} />
                                                                                                    )}
                                                                                                    <input type="text" value={choice}
                                                                                                        onChange={e => { const n = [...editQuestionChoices]; n[cIdx] = e.target.value; setEditQuestionChoices(n); }}
                                                                                                        placeholder={`ตัวเลือกที่ ${cIdx + 1}`}
                                                                                                        className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
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
                                                                                                <input type="radio" name={`eq-tf-${q.id}`} checked={editQuestionCorrect === 'True'} onChange={() => setEditQuestionCorrect('True')} />
                                                                                                True (ถูก)
                                                                                            </label>
                                                                                            <label className="flex items-center gap-2 text-sm bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200 cursor-pointer">
                                                                                                <input type="radio" name={`eq-tf-${q.id}`} checked={editQuestionCorrect === 'False'} onChange={() => setEditQuestionCorrect('False')} />
                                                                                                False (ผิด)
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
                                                                                            <button onClick={submitEditQuestion} disabled={isSaving} className="px-4 py-1.5 bg-purple-500 text-white text-xs rounded-lg font-bold hover:bg-purple-600">
                                                                                                {isSaving ? 'บันทึก...' : 'บันทึกคำถาม'}
                                                                                            </button>
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
                                                                                                            <span key={ci} className={`text-[11px] px-2 py-0.5 rounded-full border ${q.correct_answer?.includes(c)
                                                                                                                ? 'bg-green-50 border-green-300 text-green-700 font-bold'
                                                                                                                : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700'
                                                                                                                }`}>{c}</span>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                ) : null;
                                                                                            } catch { return null; }
                                                                                        })()}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1 ml-2 shrink-0">
                                                                                        <button onClick={() => handleEditQuestion(q)} className="text-slate-300 hover:text-purple-500 transition-colors" title="แก้ไขคำถาม">
                                                                                            <span className="material-symbols-outlined text-sm">edit</span>
                                                                                        </button>
                                                                                        <button onClick={() => handleDeleteQuestion(q.id)} className="text-slate-300 hover:text-red-500 transition-colors" title="ลบคำถาม">
                                                                                            <span className="material-symbols-outlined text-sm">delete</span>
                                                                                        </button>
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

                                                                    <textarea
                                                                        value={questionText}
                                                                        onChange={(e) => setQuestionText(e.target.value)}
                                                                        placeholder="คำถาม..."
                                                                        className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm"
                                                                    ></textarea>

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
                                                                                    <input
                                                                                        type="text"
                                                                                        value={choice}
                                                                                        onChange={(e) => {
                                                                                            const newChoices = [...questionChoices];
                                                                                            newChoices[cIdx] = e.target.value;
                                                                                            setQuestionChoices(newChoices);
                                                                                        }}
                                                                                        placeholder={`ตัวเลือกที่ ${cIdx + 1}`}
                                                                                        className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm"
                                                                                    />
                                                                                </div>
                                                                            ))}
                                                                            <button onClick={() => setQuestionChoices([...questionChoices, ""])} className="text-xs text-primary font-bold">+ เพิ่มตัวเลือก</button>
                                                                        </div>
                                                                    )}

                                                                    {questionType === 'true_false' && (
                                                                        <div className="flex gap-4">
                                                                            <label className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 cursor-pointer">
                                                                                <input type="radio" name={`tf-${item.id}`} checked={questionCorrect === 'True'} onChange={() => setQuestionCorrect('True')} />
                                                                                True (ถูก)
                                                                            </label>
                                                                            <label className="flex items-center gap-2 text-sm bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200 cursor-pointer">
                                                                                <input type="radio" name={`tf-${item.id}`} checked={questionCorrect === 'False'} onChange={() => setQuestionCorrect('False')} />
                                                                                False (ผิด)
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

                                                    )}
                                                </div>
                                            ))}

                                            {activeModuleDialog === module.id ? (
                                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-primary/30 space-y-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setContentType('video')}
                                                            className={`px-3 py-1 rounded-full text-xs font-bold ${contentType === 'video' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
                                                        >วิดีโอ</button>
                                                        <button
                                                            onClick={() => setContentType('text')}
                                                            className={`px-3 py-1 rounded-full text-xs font-bold ${contentType === 'text' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
                                                        >ข้อความ</button>
                                                        <button
                                                            onClick={() => setContentType('quiz')}
                                                            className={`px-3 py-1 rounded-full text-xs font-bold ${contentType === 'quiz' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
                                                        >ควิซ (แบบทดสอบ)</button>
                                                        {/* <button
                                                            onClick={() => setContentType('assignment')}
                                                            className={`px-3 py-1 rounded-full text-xs font-bold ${contentType === 'assignment' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
                                                        >การบ้าน / งาน</button> */}
                                                    </div>

                                                    <input
                                                        type="text"
                                                        value={contentTitle}
                                                        onChange={(e) => setContentTitle(e.target.value)}
                                                        placeholder="ชื่อเนื้อหา / ชื่อบทสอบ"
                                                        className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm"
                                                    />

                                                    {contentType === 'video' && (
                                                        <div className="space-y-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                                            <div className="flex gap-2">
                                                                <button onClick={() => setVideoSourceType('url')} className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${videoSourceType === 'url' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>ใช้ URL</button>
                                                                <button onClick={() => setVideoSourceType('file')} className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${videoSourceType === 'file' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>อัปโหลดไฟล์</button>
                                                            </div>

                                                            {videoSourceType === 'url' ? (
                                                                <input
                                                                    type="text"
                                                                    value={contentBody}
                                                                    onChange={(e) => setContentBody(e.target.value)}
                                                                    placeholder="URL วิดีโอ (YouTube, MP4, etc.)"
                                                                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-sm"
                                                                />
                                                            ) : (
                                                                <input
                                                                    type="file"
                                                                    accept="video/*"
                                                                    onChange={(e) => setVideoFile(e.target.files[0])}
                                                                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-sm"
                                                                />
                                                            )}
                                                            <input
                                                                type="number"
                                                                value={contentExtra}
                                                                onChange={(e) => setContentExtra(e.target.value)}
                                                                placeholder="ความยาว (นาที)"
                                                                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-sm"
                                                            />
                                                            {error && (
                                                                <div className="text-red-500 text-[10px] font-bold mt-1 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-900/30 flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-sm">error</span>
                                                                    {error}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {contentType === 'text' && (
                                                        <RichTextEditor
                                                            value={contentBody}
                                                            onChange={setContentBody}
                                                            placeholder="เขียนเนื้อหาบทเรียน (รองรับ Bold, Italic, เปลี่ยนขนาดตัวอักษร และอื่นๆ)"
                                                        />
                                                    )}

                                                    {contentType === 'quiz' && (
                                                        <input
                                                            type="number"
                                                            value={contentExtra}
                                                            onChange={(e) => setContentExtra(e.target.value)}
                                                            placeholder="คะแนนที่ผ่าน (เช่น 60)"
                                                            className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm"
                                                        />
                                                    )}

                                                    {contentType === 'assignment' && (
                                                        <textarea
                                                            value={contentBody}
                                                            onChange={(e) => setContentBody(e.target.value)}
                                                            placeholder="คำอธิบายงาน..."
                                                            className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm min-h-25"
                                                        />
                                                    )}

                                                    <div className="flex justify-end gap-2 pt-2">
                                                        <button
                                                            onClick={() => setActiveModuleDialog(null)}
                                                            className="px-3 py-1.5 text-slate-500 text-xs font-bold"
                                                        >
                                                            ยกเลิก
                                                        </button>
                                                        <button
                                                            onClick={() => handleAddContent(module.id)}
                                                            className="px-4 py-1.5 bg-primary text-white text-xs rounded-lg font-bold"
                                                            disabled={isSaving}
                                                        >
                                                            {isSaving ? "บันทึก..." : "ยืนยันเพิ่ม"}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => { setActiveModuleDialog(module.id); setContentType('video'); setContentTitle(""); setContentBody(""); setContentExtra(""); setError(null); }}
                                                    className="w-full py-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center space-x-2"
                                                >
                                                    <span className="material-symbols-outlined text-sm">add</span>
                                                    <span>เพิ่มเนื้อหา (วิดีโอ, ข้อความ, แบบทดสอบ)</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {showAddModule ? (
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-primary/30 space-y-4">
                                        <input
                                            type="text"
                                            value={newModuleTitle}
                                            onChange={(e) => setNewModuleTitle(e.target.value)}
                                            placeholder="ชื่อบทเรียนใหม่..."
                                            className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-primary"
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setShowAddModule(false)}
                                                className="px-4 py-2 text-slate-500 font-bold"
                                            >
                                                ย้อนกลับ
                                            </button>
                                            <button
                                                onClick={handleAddModule}
                                                className="px-6 py-2 bg-primary text-white rounded-lg font-bold"
                                                disabled={isSaving || !newModuleTitle.trim()}
                                            >
                                                {isSaving ? "กำลังบันทึก..." : "ยืนยันเพิ่มบทเรียน"}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowAddModule(true)}
                                        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center space-x-2"
                                    >
                                        <span className="material-symbols-outlined">add_circle</span>
                                        <span>เพิ่มบทเรียนใหม่</span>
                                    </button>
                                )}
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <button
                                    onClick={() => navigate(`/mycourses/${id}/view`)}
                                    className="bg-primary cursor-pointer text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-pink-200 dark:shadow-none"
                                >
                                    บันทึกและออก
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default EditInstanceCurriculum;
