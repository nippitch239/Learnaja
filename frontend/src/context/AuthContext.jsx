import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

function AuthProvider({ children }) {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log(decoded.roles)
                setUser(decoded);
            } catch {
                logout();
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [token]);


    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthProvider;
