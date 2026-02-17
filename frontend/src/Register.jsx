import { useState } from "react";
import api from "./services/api";
import { Link } from "react-router-dom";

function Register() {
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
        firstname,
        lastname,
        email,
        password,
        school,
      });

      setMessage(res.data.message);
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Server error");
      }
    }
  };

  return (
    <div class="bg-custom flex items-center justify-center min-h-screen">
      {/* <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <br /><br />
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <br /><br />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br /><br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br /><br />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <br /><br /> */}
        {/* <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select> */}
        {/* <br /><br /> */}
        {/* <input type="text" placeholder="School" value={school} onChange={(e) => setSchool(e.target.value)} required />
        <br /><br />

        <button type="submit">Register</button>
      </form> */}

      <p>{message}</p>

      <div class="bg-[#fafafa] rounded-4xl shadow-lg p-10 mx-auto">
        <h1 class="text-[60px] font-[800] mb-3 text-[#fb98b7]">Sign up</h1>
        <form onSubmit={handleRegister} class="flex flex-col">
            <input type="text" placeholder="Firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} class="w-[436px] p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none"/>
            <input type="text" placeholder="Lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} class="w-[436px] p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none"/>
            <input type="email" placeholder="Example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} class="w-[436px] p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none"/>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} class="w-[436px] p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none"/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} class="w-[436px] p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none"/>
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} class="w-[436px] p-2 mb-2 border-none shadow-md rounded-full bg-[#FEFEFE] px-4 mt-3 focus:ring-2 focus:ring-[#FFBCD1] focus:outline-none"/>
            <button class="w-fit mx-auto bg-[#fb98b7] text-white px-4 py-2 text-[22px] rounded-xl font-semibold hover:bg-[#FF9DB8] shadow-md mt-3" type="submit">Create Account</button>
            <label class="text-[#000]/40 flex text-center mt-4 mx-auto">Already have an account? Sign in <Link to="/login" class="block text-[#fb98b7] hover:underline pl-1">here.</Link></label>
        </form>
      </div>
    </div>
  );
}

export default Register;
