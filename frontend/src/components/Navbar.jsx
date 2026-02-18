
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-100 dark:bg-slate-900 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#fb98b7]">Learnaja</h2>
          <ul className="flex space-x-6">
            <li><Link to="/" className="text-slate-700 dark:text-slate-300 hover:text-primary">Home</Link></li>
            <li><Link to="/courses" className="text-slate-700 dark:text-slate-300 hover:text-primary">Courses</Link></li>
            <li><Link to="/mentors" className="text-slate-700 dark:text-slate-300 hover:text-primary">Mentors</Link></li>
            <li><Link to="/contact" className="text-slate-700 dark:text-slate-300 hover:text-primary">Contact</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;