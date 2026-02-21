import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function MyCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get("/courses");
            setCourses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="m-6">
            <h1 className="text-3xl font-bold">My Courses</h1>
            <div className="mt-5 grid grid-cols-4 gap-6">
                {courses.length === 0 && <p>No courses found</p>}

                {courses.map(course => (
                    <div key={course.id} onClick={(e) => { e.stopPropagation(); navigate(`/mycourses/${course.id}`) }} className="border border-slate-200 p-5 rounded-xl">
                        <h3 className="text-slate-700 dark:text-slate-300 text-3xl">{course.title}</h3>
                        <p className="mb-5">{course.description}</p>
                        <Link className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-[#FF9DB8]" to={`/mycourses/${course.id}`} onClick={(e) => { e.stopPropagation(); }}>View</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}export default MyCourses;