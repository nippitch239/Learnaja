import api from "./api";

const fetchCourse = async (id) => {
    try {
        const res = await api.get(`/courses/${id}`);
        // console.log(res.data)
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

const fetchCourses = async () => {
    try {
        const res = await api.get("/courses");
        // console.log(res.data)
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export { fetchCourse, fetchCourses };