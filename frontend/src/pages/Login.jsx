import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";


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
        navigate("/home");
    };

    return (
        <>
            <div className="bg-custom flex items-center justify-center min-h-screen">
                <div className="bg-[#fafafa] rounded-4xl shadow-lg p-10 mx-auto" >
                    <h1 className="text-[60px] mb-3 font-extrabold text-primary">Log in</h1>
                    <div className="flex flex-col" onSubmit={handleLogin}>
                        <input type="text" placeholder="username or email" onChange={e => setUser(e.target.value)} className="w-109 p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none"/>
                        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="w-109 p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none"/>
                        <button className="w-50 mx-auto bg-primary text-white px-4 py-2 text-[22px] rounded-xl font-semibold hover:bg-[#FF9DB8] shadow-md mt-5" onClick={handleLogin}>Log in</button>
                        <label htmlFor="" className="text-black/40 flex text-center mt-5 mx-auto">Don’t have an account? Sign up <Link to="/register" className="block text-primary hover:underline pl-1">here.</Link></label>
                    </div>
                </div>
            </div>
        </>
);
}

            export default Login;
