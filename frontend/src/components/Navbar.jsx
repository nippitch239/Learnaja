import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3200";
    const [profile, setProfile] = useState({ image_profile: null });

    useEffect(() => {
        if (user) {
            api.get("/profile/me").then(res => {
                setProfile(res.data);
            }).catch(err => console.error("Error fetching navbar profile:", err));
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100">
            <nav className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    className="bg-primary rounded-2xl shadow-lg px-6 py-3 flex items-center justify-between">
                    <Link onClick={() => toggleDropdown()} to="/home">
                        <div className="flex items-center space-x-2">
                            <span
                                className="material-symbols-outlined text-white text-3xl">book_4</span>
                            <span
                                className="text-white font-bold text-2xl tracking-tight">Learnaja</span>
                        </div>
                    </Link>
                    {/* <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full">
                            <span
                                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#fb90a9]">search</span>
                            <input
                                className="w-full bg-white/20 border-none rounded-full py-2 pl-12 pr-4 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 transition-all"
                                placeholder="ค้นหาคอร์สเรียน..." type="text" />
                        </div>
                    </div> */}
                    <div className="flex items-center space-x-6 text-white font-medium">
                        <Link className="hidden lg:block hover:opacity-80 transition"
                            to="/mycourses">My Courses</Link>
                        {user?.roles?.includes("admin") && <li><Link to="/admin" className="text-slate-700 dark:text-slate-300">Admin</Link></li>}
                        <div className="hidden lg:flex items-center space-x-1">
                            <span className="text-sm">{user?.point} Points</span>
                            <span className="material-symbols-outlined text-xl">toll</span>
                        </div>

                        <div //image, profile
                            ref={dropdownRef}
                            className="relative flex items-center space-x-2 border-l border-white/20 pl-4">
                            <Link onClick={(e) => e.stopPropagation()} to="/profile">
                                <img alt="User profile"
                                    className="h-9 w-9 rounded-full bg-white/20 border border-white/40 object-cover"
                                    src={profile.image_profile ? `${API_BASE}${profile.image_profile}` : "/images/user.png"} />
                            </Link>
                            <div>
                                <span
                                    className="material-symbols-outlined text-sm hover:opacity-80 transition cursor-pointer " onClick={toggleDropdown}>expand_more</span>
                                <div id="dropdown-menu" className={`absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-2 ${isDropdownOpen ? 'block' : 'hidden'}`}>
                                    <Link onClick={() => toggleDropdown()} to="/profile">
                                        <li className="px-4 py-2  text-primary list-none">
                                            <div className="flex items-center">
                                                <img src={profile.image_profile ? `${API_BASE}${profile.image_profile}` : "/images/user.png"} alt="user profile" className="h-8 w-8 rounded-full bg-white/20 border border-white/40 object-cover inline-block mr-2" />
                                                <span className="align-middle">{profile.username || "Guest"}</span>
                                            </div>
                                            <hr className="mt-3 border-slate-200 dark:border-slate-700" />
                                        </li>
                                    </Link>
                                    <Link onClick={() => toggleDropdown()} to="/mycourses"><li className="px-4 py-2 hover:bg-primary/10 dark:hover:bg-slate-700 cursor-pointer text-primary list-none "><span className="material-symbols-outlined text-sm mr-2">school</span>คอร์สของฉัน</li></Link>
                                    <Link onClick={() => toggleDropdown()} to="/courses"><li className="px-4 py-2 hover:bg-primary/10  dark:hover:bg-slate-700 cursor-pointer text-primary list-none "><span className="material-symbols-outlined text-sm mr-2 align-middle">school</span>คอร์สทั้งหมด</li></Link>
                                    <li className="px-4 py-2 hover:bg-primary/10 dark:hover:bg-slate-700 cursor-pointer text-primary list-none"><span className="material-symbols-outlined text-sm mr-2">Settings</span>การตั้งค่า</li>
                                    <li className="px-4 py-2 hover:bg-primary/10 dark:hover:bg-slate-700 cursor-pointer text-primary list-none "><button onClick={handleLogout}><span className="material-symbols-outlined text-sm mr-2">logout</span>ออกจากระบบ</button></li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;