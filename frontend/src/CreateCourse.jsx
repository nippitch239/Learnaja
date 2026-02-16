import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";

function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title) {
      return setError("Title is required");
    }

    try {
      setLoading(true);

      const res = await api.post("/courses", {
        title,
        description,
      });

      console.log(res.data);

      navigate('/create-course')

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Error creating course");
      } else {
        setError("Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2>Create Course</h2>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 15px",
            cursor: "pointer"
          }}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}

export default CreateCourse;
