import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";


function Login() {
    const { login } = useContext(AuthContext);
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await api.post("/login", {
                user,
                password
            });

            login(res.data.token);
            navigate("/home");
        } catch (err) {
            alert("Try Again Later.");
            console.log(err);
        }
    };

    return (
        <>
            <div className="bg-custom flex items-center justify-center min-h-screen">
                <div className="bg-[#fafafa] rounded-4xl shadow-lg p-10 mx-auto opacity-0  animate-[slideUp_0.6s_ease-out_forwards]" >
                    <h1 className="text-[60px] mb-3 font-extrabold text-primary">ลงชื่อเข้าใช้</h1>
                    <div className="flex flex-col" onSubmit={handleLogin}>
                        <input type="text" placeholder="ชื่อผู้ใช้ หรือ อีเมล" onChange={e => setUser(e.target.value)} className="w-109 p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none" />
                        <input type="password" placeholder="รหัสผ่าน" onChange={e => setPassword(e.target.value)} className="w-109 p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none" />
                        <button className="w-50 mx-auto bg-primary text-white px-4 py-2 text-[22px] rounded-xl font-semibold hover:bg-[#FF9DB8] shadow-md mt-5" onClick={handleLogin}>เข้าสู่ระบบ</button>
                        <label htmlFor="" className="text-black/40 flex text-center mt-5 mx-auto">ยังไม่มีบัญชี? ลงทะเบียนผู้ใช้ใหม่ <Link to="/register" className="block text-primary hover:underline pl-1">ที่นี่</Link></label>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
