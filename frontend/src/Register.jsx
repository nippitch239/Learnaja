import { useState } from "react";
import api from "./services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
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
        name,
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
    <div>
      <h2>Register</h2>

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
        <br /><br />
        {/* <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select> */}
        {/* <br /><br /> */}
        <input type="text" placeholder="School" value={school} onChange={(e) => setSchool(e.target.value)} required />
        <br /><br />

        <button type="submit">Register</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Register;
