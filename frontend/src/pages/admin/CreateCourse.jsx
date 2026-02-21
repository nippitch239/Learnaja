import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


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
        price,
      });

      console.log(res.data);
      setMessage("Course created successfully");


    } catch (err) {
      setMessage("Error creating course");
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
    <div className="container mx-auto px-4">
      <h2 className="text-xl font-bold text-primary my-4">Create Course</h2>



      <form onSubmit={handleSubmit}>
        <div className="mb-4">

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-4 block p-2 w-50 rounded-md outline-primary shadow-lg sm:text-sm h-10"
          />

        </div>

        <div className="mb-4">

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-4 block p-2 w-50 rounded-md outline-primary shadow-lg sm:text-sm h-10"
          />

        </div>
        <div className="mb-4">

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-4 block p-2 w-50 rounded-md outline-primary shadow-lg sm:text-sm h-10"
          />

        </div>

        {error && (
          <p className="text-red-500">{error}</p>
        )}
        {message && (
          <p className="text-green-500">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex cursor-pointer justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}

export default CreateCourse;
