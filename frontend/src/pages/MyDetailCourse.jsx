import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCourse } from "../services/fetchCourse";

function MyDetailCourse() {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const data = await fetchCourse(id);
                setCourse(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadCourse();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!course) return <p>Course not found</p>;

    return (
        <div className="container mx-auto px-4 my-5">
            <h1 className="text-3xl font-bold">My Detail Course</h1>
            <div>
                <p>{course.title}</p>
                <p>{course.description}</p>
                <p>{course.price}</p>
            </div>
            <button
                className="bg-[#4d4d4d] text-white px-4 py-2 rounded-xl hover:bg-[#a1a1a1] m-6"
                onClick={() => navigate(-1)}
            >
                Back
            </button>

            <button
                className="bg-[#76ff5b] text-white px-4 py-2 rounded-xl hover:bg-[#a1a1a1] m-6"
                onClick={() => navigate(`/mycourses/${id}/invite`)}
            >
                Invite
            </button>
        </div>
    );
}
export default MyDetailCourse;