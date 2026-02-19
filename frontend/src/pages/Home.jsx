import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {

    return (
        <>
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded cursor-pointer" onClick={handleLogout}>Logout</button>
        </>
    );
}

export default Home;
