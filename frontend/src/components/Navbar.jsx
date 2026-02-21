
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import profile from "../assets/profile.avif"

function Navbar() {
  const { user } = useContext(AuthContext);
  return (
    <nav className="bg-slate-100 dark:bg-slate-900 py-4 cursor-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/"><h2 className="text-xl font-bold text-primary">Learnaja</h2></Link>
          <ul className="flex space-x-6">
            <li><Link to="/" className="text-slate-700 dark:text-slate-300 hover:text-primary">Home</Link></li>
            <li><Link to="/courses" className="text-slate-700 dark:text-slate-300 hover:text-primary">Courses</Link></li>
            <li><Link to="/mentors" className="text-slate-700 dark:text-slate-300 hover:text-primary">Mentors</Link></li>
            <li><Link to="/contact" className="text-slate-700 dark:text-slate-300 hover:text-primary">Contact</Link></li>
            <li><Link to="/mycourses" className="text-slate-700 dark:text-slate-300 hover:text-primary">My Courses</Link></li>
            {user?.roles?.includes("admin") && <li><Link to="/admin" className="text-slate-700 dark:text-slate-300 hover:text-primary">Admin</Link></li>}
            <div className="flex items-center">
              <img className="w-6 h-6 rounded-full" src={profile} alt="" />
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;