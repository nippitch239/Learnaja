import { useState } from "react";

import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [school, setSchool] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const options = [
    { value: '3', label: 'Student' },
    { value: '2', label: 'Teacher' },
    { value: '1', label: 'Admin' },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/register", {
        username,
        name: firstname + " " + lastname,
        email,
        password,
        school,
      });

      setMessage(res.data.message);
      console.log(res.data.message);
      setTimeout(() => {
        setMessage("");
        navigate("/login");
      }, 3000);

    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
        console.log(err.response.data.message);
      } else {
        setMessage("Server error");
        console.log("Server error");
      }
    }
  };

  return (
    <div className="bg-custom flex items-center justify-center min-h-screen">

      <div className="bg-[#fafafa] rounded-4xl shadow-lg p-10 mx-auto opacity-0  animate-[slideUp_0.6s_ease-out_forwards]" >
        <h1 className="text-[60px] font-extrabold mb-3 text-primary">ลงทะเบียน</h1>
        <form onSubmit={handleRegister} className="flex flex-col">
          <input type="text" placeholder="ชื่อผู้ใช้" value={username} onChange={(e) => setUsername(e.target.value)} className="w-109 p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none" />
          <input type="text" placeholder="ชื่อจริง" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="w-109 p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none" />
          <input type="text" placeholder="นามสกุล" value={lastname} onChange={(e) => setLastname(e.target.value)} className="w-109 p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none" />
          <input type="email" placeholder="จดหมายอิเล็กทรอนิกส์" value={email} onChange={(e) => setEmail(e.target.value)} className="w-109 p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none" />
          <input type="password" placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} className="w-109 p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none" />
          <input type="password" placeholder="ยืนยันรหัสผ่าน" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-109 p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none" />
          <p>{message}</p>
          <button className="w-50 mx-auto bg-primary text-white px-4 py-2 text-[22px] rounded-xl font-semibold hover:bg-[#ff6e97] hover:transition-all shadow-md mt-3 " type="submit">สร้างบัญชี</button>
          <label className="text-black/40 flex text-center mt-4 mx-auto">มีบัญชีแล้ว? เข้าสู่ระบบได้ <Link to="/login" className="block text-primary hover:underline pl-1">ที่นี่</Link></label>
        </form>
      </div>
    </div>
  );
}

export default Register;
