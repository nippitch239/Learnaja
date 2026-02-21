import { useEffect, useState, useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

/**
 * Validates that the user has access to a specific course instance (either as owner or student).
 */
function RequireOwner({ children }) {
    const { id } = useParams(); // This is now the instance ID
    const [status, setStatus] = useState("loading");
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        if (loading) return;
        if (!user) {
            setStatus("denied");
            return;
        }

        const checkAccess = async () => {
            try {
                // We use our new endpoint which checks both ownership and student invitation
                const res = await api.get(`/instances/${id}`);

                if (res.status === 200) {
                    setStatus("allowed");
                } else {
                    setStatus("denied");
                }
            } catch (err) {
                console.error("Access check failed:", err);
                setStatus("denied");
            }
        };

        checkAccess();
    }, [id, user, loading]);

    if (status === "loading") return <p className="m-6 text-xl">Checking permissions...</p>;

    if (status === "denied") {
        // If denied, redirect to main courses page or somewhere appropriate
        return <Navigate to="/courses" replace />;
    }

    return children;
}

export default RequireOwner;
