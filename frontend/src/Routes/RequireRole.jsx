import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function RequireRole({ children, role }) {
    const { user } = useContext(AuthContext);

    if (!user || !user.roles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RequireRole;
