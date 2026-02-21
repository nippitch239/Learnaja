import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { fetchCourse, fetchMyCourses, fetchInstance } from "../services/fetchCourse";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isowner, setIsOwner] = useState(false);
  const [ownedInstanceId, setOwnedInstanceId] = useState(null);
  const [message, setMessage] = useState("");

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse(id).then((res) => {
      setCourse(res);
    });
    if (user) {
      calculateOwnership();
    }
  }, [id, user]);

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

  const calculateOwnership = async () => {
    try {
      const data = await fetchMyCourses();
      const instance = data?.find(c => c.template_id === parseInt(id));
      if (instance) {
        setIsOwner(true);
        setOwnedInstanceId(instance.id);
      } else {
        setIsOwner(false);
        setOwnedInstanceId(null);
      }
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

      const res = await api.post(`/courses/${id}/buy`, {
        id: user.id
      });
      setMessage(res.data.message);
      // Re-fetch ownership to get the new instance ID
      await calculateOwnership();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error purchasing course");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-2xl m-6">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p>{course.description}</p>
        <p>Price: {course.price} บาท</p>

        {message && <p className="mt-2 text-blue-600">{message}</p>}
        {isowner && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (ownedInstanceId) navigate(`/mycourses/${ownedInstanceId}`);
              }}
              className="bg-primary text-white px-6 mt-3 py-2 rounded-xl hover:bg-[#FF9DB8] cursor-pointer"
            >
              Start Learning
            </button>
            <hr className="border-gray-400 my-4" />
            <p className="mt-3 ml-2">You already bought this course. Find all your courses <Link className="text-primary underline" to={`/mycourses`}>here</Link></p>
          </>
        )}

        {!isowner && <button className="bg-primary text-white px-6 mt-3 py-2 rounded-xl hover:bg-[#FF9DB8] cursor-pointer" onClick={handleBuy}>Buy</button>}
      </div>

      <button className="bg-[#4d4d4d] text-white px-4 py-2 rounded-xl hover:bg-[#a1a1a1] m-6 cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(-1) }}>Back</button>
    </>
  );
}

export default CourseDetail;
