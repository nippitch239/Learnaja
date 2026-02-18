import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import api from "../services/api";


function CourseEdit() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const res = await api.get(`/courses/${id}`);
            console.log(res.data)
            setCourse(res.data);

        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = async () => {
        try {
            const res = await api.put(`/courses/${id}/edit`, {
                title: course.title,
                description: course.description,
            });
            console.log(res.data)
        }
        catch (err) {
            console.error(err)
        }
    };

    if (!course) return <p>Loading...</p>;

    return (
        <div>
            <h1>{course.title}</h1>
            <input type="text" value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} />
            <p>{course.description}</p>
            <input type="text" value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />

            <Link to={`/courses/${id}`}>Back</Link>
            <button onClick={handleEdit}>Confirm</button>
        </div>
    );
}

export default CourseEdit;
