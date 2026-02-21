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

const fetchMyCourses = async () => {
    try {
        const res = await api.get(`/courses/owner`);
        // console.log(res.data)
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

const fetchInvitedCourses = async () => {
    try {
        const res = await api.get(`/courses/invited`);
        // console.log(res.data)
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

const fetchInstance = async (id) => {
    try {
        const res = await api.get(`/instances/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export { fetchCourse, fetchCourses, fetchMyCourses, fetchInvitedCourses, fetchInstance };