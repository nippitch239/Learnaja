import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../services/api";


function CourseEdit() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

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
                price: course.price,
            });

            setMessage("Course updated successfully");
            setTimeout(() => {
                setMessage("");
            }, 2000);
            console.log(res.data)
        }
        catch (err) {
            console.error(err)
        }
    };

    if (!course) return <p>Loading...</p>;

    return (
        <div className="container mx-auto mt-5">
            <h1 className="text-2xl font-bold text-primary">Edit Course</h1>
            <h1 className="text-2xl font-bold mt-5">Title: <span className="text-primary">{course.title}</span></h1>
            <input className="border border-slate-200 dark:border-slate-700" type="text" value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} />
            <h1 className="text-2xl font-bold mt-5">Description: <span className="text-primary">{course.description}</span></h1>
            <input className="border border-slate-200 dark:border-slate-700" type="text" value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
            <h1 className="text-2xl font-bold mt-5">Price: <span className="text-primary">{course.price}</span></h1>
            <input className="border border-slate-200 dark:border-slate-700" type="number" value={course.price} onChange={(e) => setCourse({ ...course, price: e.target.value })} />

            <p className="text-green-500">{message}</p>

            <br />
            <button onClick={() => navigate(-1)} className="text-primary px-4 py-2 rounded-md mt-5 border border-primary cursor-pointer">Back</button>
            <button onClick={handleEdit} className="bg-primary text-white px-4 py-2 rounded-md mt-5 mx-2 cursor-pointer">Confirm</button>
        </div>
    );
}

export default CourseEdit;
