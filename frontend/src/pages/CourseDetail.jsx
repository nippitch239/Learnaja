import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import fetchCourse from "../services/fetchCourse";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isowner, setIsOwner] = useState(false);
  const [message, setMessage] = useState("");

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse(id).then((res) => {
      setCourse(res);
    });
    fetchIsOwner();
  }, []);

  useEffect(() => {
    if (isowner) {
      navigate(`/courses/${id}`);
    }
  }, [isowner]);



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
        console.log("You already buy this course");
        return;
      }

      console.log(id)

      const res = await api.post(`/courses/${id}/buy`, {
        id: user.id
      });
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

  if (!course) return <p>Loading...</p>;

  return (
    <>
      {/* <div className="grid grid-cols-4 m-6"> */}

      <div className="bg-white p-6 rounded-xl shadow-2xl m-6">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p>{course.description}</p>
        <p>Price: {course.price} บาท</p>

        {message && <p>{message}</p>}
        {isowner && (
          <>
            <button onClick={(e) => { e.stopPropagation(); navigate(`/mycourses/${id}`) }} className="bg-primary text-white px-6 mt-3 py-2 rounded-xl hover:bg-[#FF9DB8] cursor-pointer">Start Learning</button>
            <hr className="border-gray-400 my-4" />
            <p className="mt-3 ml-2">You already buy this course, Find your courses <Link className="text-primary underline" to={`/mycourses`}>here</Link></p>
          </>
        )}

        {!isowner && <button className="bg-primary text-white px-6 mt-3 py-2 rounded-xl hover:bg-[#FF9DB8] cursor-pointer" onClick={handleBuy}>Buy</button>}
      </div>

      {/* </div> */}
      <button className="bg-[#4d4d4d] text-white px-4 py-2 rounded-xl hover:bg-[#a1a1a1] m-6" onClick={(e) => { e.stopPropagation(); navigate(-2) }}>Back</button>
    </>
  );
}

export default CourseDetail;
