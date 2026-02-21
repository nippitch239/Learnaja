import { useEffect, useState, useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function RequireOwner({ children }) {
    const { id } = useParams();
    const [status, setStatus] = useState("loading");
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        if (loading) return <p>Loading...</p>;
        if (!user) {
            setStatus("denied");
            return;
        }
        const checkOwner = async () => {
            try {
                const res = await api.get(`/courses/${id}/owner`);

                if (res.data === true) {
                    setStatus("allowed");
                } else {
                    setStatus("denied");
                }

            } catch (err) {
                setStatus("denied");
            }
        };

        checkOwner();
    }, [id]);

    if (status === "loading") return <p>Checking permission...</p>;

    if (status === "denied") {
        return <Navigate to={`/courses/${id}`} replace />;
    }

    return children;
}

export default RequireOwner;
