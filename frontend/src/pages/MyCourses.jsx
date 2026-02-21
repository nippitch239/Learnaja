import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchMyCourses, fetchInvitedCourses } from "../services/fetchCourse";

function MyCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [fetching, setFetching] = useState(true);

    const { user, loading } = useContext(AuthContext);
    const [invitedCourses, setInvitedCourses] = useState([]);
    const [fetchingInvited, setFetchingInvited] = useState(true);

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate('/login');
        fetchMyCourses().then(courses => {
            setCourses(courses);
            setFetching(false);
        });
        fetchInvitedCourses().then(courses => {
            setInvitedCourses(courses);
            setFetchingInvited(false);
        });
    }, [user, loading, navigate]);

    if (loading || fetching || fetchingInvited) return <p className="m-6">Loading...</p>;

    return (
        <>
            <div className="m-6 container mx-auto">
                <h1 className="text-3xl font-bold">My Courses</h1>
                <div className="mt-5 grid grid-cols-4 gap-6">
                    {courses.length === 0 && <p>No courses found</p>}

                    {courses.map(course => (
                        <div key={course.id} onClick={(e) => { e.stopPropagation(); navigate(`/mycourses/${course.template_id}`) }} className="border border-slate-200 p-5 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                            <h3 className="text-slate-700 dark:text-slate-300 text-3xl">{course.title}</h3>
                            <p className="mb-5">{course.description}</p>
                            <Link className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-[#FF9DB8]" to={`/mycourses/${course.template_id}`} onClick={(e) => { e.stopPropagation(); }}>View</Link>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="my-5 border-slate-400 container mx-auto" />

            <div className="m-6 container mx-auto">
                <h1 className="text-3xl font-bold">Invited</h1>
                <div className="mt-5 grid grid-cols-4 gap-6">
                    {invitedCourses.length === 0 && <p>No courses found</p>}

                    {invitedCourses.map(course => (
                        <div key={course.id} onClick={(e) => { e.stopPropagation(); navigate(`/mycourses/${course.template_id}`) }} className="border border-slate-200 p-5 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                            <h3 className="text-slate-700 dark:text-slate-300 text-3xl">{course.title}</h3>
                            <p className="mb-5">{course.description}</p>
                            <Link className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-[#FF9DB8]" to={`/mycourses/${course.template_id}`} onClick={(e) => { e.stopPropagation(); }}>View</Link>
                        </div>
                    ))}
                </div>
            </div>
        </>

    );
} export default MyCourses;