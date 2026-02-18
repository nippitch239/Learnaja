import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import api from "../services/api";


function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isowner, setIsOwner] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse();
    fetchIsOwner();
  }, []);

  useEffect(() => {
    if (isowner) {
      navigate(`/courses/${id}`);
    }
  }, [isowner]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      console.log(res.data)
      setCourse(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const fetchIsOwner = async () => {
    try {
      const res = await api.get(`/courses/${id}/owner`);
      setIsOwner(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuy = async () => {
    try {

      if (isowner) {
        return;
      }

      const res = await api.post(`/courses/${id}/buy`);
      setIsOwner(true);
      setMessage(res.data.message);

    } catch (err) {
      console.error(err);
      setMessage(err.response.data.message);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const handleEdit = async () => {
    navigate(`/courses/${id}/edit`);
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Price: {course.price} บาท</p>

      <Link to="/courses">Back</Link>
      {message && <p>{message}</p>}
      {isowner && <button onClick={handleEdit}>Edit</button>}
      {!isowner && <button onClick={handleBuy}>Buy</button>}
    </div>
  );
}

export default CourseDetail;
