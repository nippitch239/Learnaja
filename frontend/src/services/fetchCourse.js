import api from "./api";

const fetchCourse = async (id) => {
    try {
        const res = await api.get(`/courses/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

const fetchCourseFull = async (id) => {
    try {
        const res = await api.get(`/courses/${id}/full`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

const fetchCourses = async (search = "", sortBy = "", limit = "") => {
    try {
        let url = `/courses?search=${search}`;
        if (sortBy) url += `&sortBy=${sortBy}`;
        if (limit) url += `&limit=${limit}`;
        const res = await api.get(url);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

const fetchMyCourses = async () => {
    try {
        const res = await api.get(`/courses/owner`);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

const fetchInvitedCourses = async () => {
    try {
        const res = await api.get(`/courses/invited`);
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

export { fetchCourse, fetchCourseFull, fetchCourses, fetchMyCourses, fetchInvitedCourses, fetchInstance };