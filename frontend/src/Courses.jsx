import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./services/api";


function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(course => course.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>All Courses</h1>

      <Link to="/create-course">+ Create Course</Link>

      <div style={{ marginTop: "20px" }}>
        {courses.length === 0 && <p>No courses found</p>}

        {courses.map(course => (
          <div key={course.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Price: {course.price} บาท</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
