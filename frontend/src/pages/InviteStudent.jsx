import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCourse } from "../services/fetchCourse";

import AsyncSelect from "react-select/async";

import api from "../services/api";

function InviteStudent() {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const courseData = await fetchCourse(id);
                setCourse(courseData);
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
                api.post(`/courses/${id}/invite`, { studentId: opt.value })
            );

            await Promise.all(promises);

            setMessage("All selected students invited successfully!");
            setSelectedOptions([]);
            loadStudents(); // Refresh the list
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
            const res = await api.get(`/courses/${id}/owner`);
            console.log(res.data);
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
            await api.delete(`/courses/${id}/invite`, { data: { studentId } });
            setMessage("Student removed successfully!");
            loadStudents(); // Refresh the list
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error removing student");
            setTimeout(() => setMessage(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !course) return <p className="m-6">Loading...</p>;
    if (!course) return <p className="m-6">Course not found</p>;

    return (
        <div className="container mx-auto px-4 my-5">
            <h1 className="text-3xl font-bold mb-4">Invite Student to {course.title}</h1>

            {message && (
                <div className={`px-4 py-3 rounded mb-4 ${message.includes("Error") ? "bg-red-100 border border-red-400 text-red-700" : "bg-blue-100 border border-blue-400 text-blue-700"}`}>
                    {message}
                </div>
            )}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <p className="font-semibold mb-2">Search students to invite</p>
                <AsyncSelect
                    isMulti
                    cacheOptions
                    loadOptions={loadUsersOptions}
                    value={selectedOptions}
                    onChange={setSelectedOptions}
                    placeholder="Type username to search..."
                    className="my-4"
                />

                <button
                    onClick={handleInvite}
                    disabled={loading}
                    className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-[#FF9DB8] transition cursor-pointer"
                >
                    {loading ? "Inviting..." : "Invite Selected Students"}
                </button>
            </div>

            <button
                className="bg-[#4d4d4d] text-white px-4 py-2 rounded-xl hover:bg-[#a1a1a1] mt-6 cursor-pointer"
                onClick={() => navigate(-1)}
            >
                Back
            </button>

            <table className="mt-6 w-full">
                <thead className="bg-gray-200 text-left">
                    <tr className="text-left">
                        <th className="px-4 py-2">Username</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr className="text-left not-odd:bg-gray-300" key={student.id}>
                            <td className="px-4 py-2">{student.username}</td>
                            <td className="px-4 py-2">{student.email}</td>
                            <td className="px-4 py-2">
                                <button onClick={() => handleDeleteInvite(student.id)} className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition cursor-pointer">Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InviteStudent;