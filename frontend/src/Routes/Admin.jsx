import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (!user?.roles?.includes("admin")) return <Navigate to="/" />;

    return children;
}


export default AdminRoute;
