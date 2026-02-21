import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInstance } from "../services/fetchCourse";
import { AuthContext } from "../context/AuthContext";

function MyDetailCourse() {
    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const loadInstance = async () => {
            try {
                const data = await fetchInstance(id);
                setInstance(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadInstance();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!instance) return <p>Course Instance not found</p>;

    return (
        <div className="container mx-auto px-4 my-5">
            <h1 className="text-3xl font-bold">My Course Details</h1>
            <div className="mt-5">
                <p className="text-2xl font-semibold">{instance.title}</p>
                <p className="text-slate-600 dark:text-slate-400">{instance.description}</p>
                <p className="mt-2 font-bold">Role: <span className="capitalize">{instance.role}</span></p>
                {instance.role === 'student' && (
                    <p className="text-sm text-blue-500 mt-2">You are participating in this course as an invited student.</p>
                )}
            </div>

            <div className="mt-8 flex gap-4">
                <button
                    className="bg-[#4d4d4d] text-white px-6 py-2 rounded-xl hover:bg-[#a1a1a1] cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>

                {instance.role === 'owner' && user?.roles?.includes('teacher') && (
                    <button
                        className="bg-[#76ff5b] text-white px-6 py-2 rounded-xl hover:bg-[#52d03b] cursor-pointer transition-colors"
                        onClick={() => navigate(`/mycourses/${instance.id}/invite`)}
                    >
                        Invite Students
                    </button>
                )}
            </div>
        </div>
    );
}

export default MyDetailCourse;
