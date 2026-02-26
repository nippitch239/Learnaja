import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInstance } from "../services/fetchCourse";
import { AuthContext } from "../context/AuthContext";

import AsyncSelect from "react-select/async";

import api from "../services/api";

function InviteStudent() {
    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const data = await fetchInstance(id);
                setInstance(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [id]);

    const loadUsersOptions = async (inputValue) => {
        if (!inputValue) return [];
        try {
            const res = await api.get(`/users/search?q=${inputValue}`);
            return res.data.map(u => ({
                value: u.id,
                label: `${u.username} (${u.email})`
            }));
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const handleInvite = async () => {
        if (selectedOptions.length === 0) {
            setMessage("Please select at least one student");
            return;
        }

        try {
            setLoading(true);
            const promises = selectedOptions.map(opt =>
                api.post(`/instances/${id}/invite`, { studentId: opt.value })
            );

            await Promise.all(promises);

            setMessage("All selected students invited successfully!");
            setSelectedOptions([]);
            loadStudents();
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error inviting some students");
            setTimeout(() => setMessage(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    const loadStudents = async () => {
        try {
            const res = await api.get(`/instances/${id}/students`);
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadStudents();
    }, [id]);

    const handleDeleteInvite = async (studentId) => {
        if (!confirm("Are you sure you want to remove this student?")) return;
        try {
            setLoading(true);
            await api.delete(`/instances/${id}/invite`, { data: { studentId } });
            setMessage("Student removed successfully!");
            loadStudents();
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error removing student");
            setTimeout(() => setMessage(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !instance) return <p className="m-6 text-xl">Loading...</p>;
    if (!instance) return <p className="m-6 text-xl text-red-500">Course Instance not found</p>;

    const isTeacher = user?.roles?.includes('teacher');

    return (
        <div className="container mx-auto px-4 my-5">
            <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">Invite Students to {instance.title}</h1>

            {message && (
                <div className={`px-4 py-3 rounded mb-4 transition-all ${message.includes("Error") ? "bg-red-100 border border-red-400 text-red-700" : "bg-blue-100 border border-blue-400 text-blue-700"}`}>
                    {message}
                </div>
            )}

            {isTeacher && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 mb-8">
                    <p className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Search students by username or email</p>
                    <AsyncSelect
                        isMulti
                        cacheOptions
                        loadOptions={loadUsersOptions}
                        value={selectedOptions}
                        onChange={setSelectedOptions}
                        placeholder="Type to search..."
                        className="my-4"
                    />

                    <button
                        onClick={handleInvite}
                        disabled={loading}
                        className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-[#FF9DB8] transition-all cursor-pointer shadow-md disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Invite Selected Students"}
                    </button>
                </div>
            )}

            <div className="mt-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Current Students</h2>
                <button
                    className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-2 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all cursor-pointer"
                    onClick={() => navigate(`/mycourses/${id}/edit`)}
                >
                    Back to Editor
                </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Username</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Email</th>
                            {isTeacher && <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={isTeacher ? "3" : "2"} className="px-6 py-8 text-center text-slate-500 italic">No students invited yet.</td>
                            </tr>
                        ) : students.map(student => (
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" key={student.id}>
                                <td className="px-6 py-4 text-slate-800 dark:text-slate-300 font-medium">{student.username}</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{student.email}</td>
                                {isTeacher && (
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDeleteInvite(student.id)}
                                            className="text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InviteStudent;