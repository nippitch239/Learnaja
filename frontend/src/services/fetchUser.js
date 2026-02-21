import api from "./api";

const fetchUsers = async () => {
    try {
        const res = await api.get("/users/");
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export { fetchUsers };