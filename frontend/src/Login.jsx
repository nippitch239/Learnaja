import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import api from "./services/api";

function Login() {
    const { login } = useContext(AuthContext);
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const res = await api.post("/login", {
            user,
            password
        });

        console.log(res)

        login(res.data.token);
        navigate("/");
    };

    return (
        <div>
            <h2>Login</h2>
            <input onChange={e => setUser(e.target.value)} placeholder="Email/Username" />
            <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
