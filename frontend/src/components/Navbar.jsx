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
    const [profile, setProfile] = useState({ image_profile: null, points: 0 });

    const fetchProfile = () => {
        if (user) {
            api.get("/profile/me").then(res => {
                setProfile(res.data);
            }).catch(err => console.error("Error fetching navbar profile:", err));
        }
    };

    useEffect(() => {
        fetchProfile();

        const handleProfileUpdate = () => fetchProfile();
        window.addEventListener("profileUpdated", handleProfileUpdate);

        return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
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
                <div className="bg-primary rounded-2xl shadow-lg px-6 py-3 flex items-center justify-between">
                    <Link to="/home">
                        <div className="flex items-center space-x-2">
                            <span><img src="/images/logo_white.png" alt="Learnaja Logo" className="h-8 w-8" /></span>
                            <span className="text-white font-bold text-2xl tracking-tight">Learnaja</span>
                        </div>
                    </Link>
                    {/* Search bar commented out */}
                    {user && (
                        <div className="flex items-center space-x-6 text-white font-medium">
                            <Link className="hidden lg:block hover:opacity-80 transition" to="/mycourses">คอร์สของฉัน</Link>
                            <div className="hidden lg:flex items-center space-x-1">
                                <span className="text-sm">{(profile?.points !== undefined ? profile.points : (user?.points ?? 0))} Points</span>
                                <span className="material-symbols-outlined text-xl">toll</span>
                            </div>

                            <div
                                ref={dropdownRef}
                                className="relative flex items-center space-x-2 border-l border-white/20 pl-4">
                                <Link onClick={(e) => e.stopPropagation()} to="/profile">
                                    <img alt="User profile"
                                        className="h-9 w-9 rounded-full bg-white/20 border border-white/40 object-cover"
                                        src={profile.image_profile ? `${API_BASE}${profile.image_profile}` : "/images/user.png"} />
                                </Link>
                                <div>
                                    <span
                                        className="material-symbols-outlined text-sm hover:opacity-80 transition cursor-pointer align-middle"
                                        onClick={toggleDropdown}>expand_more</span>
                                    <div id="dropdown-menu" className={`absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-2 ${isDropdownOpen ? 'block' : 'hidden'}`}>
                                        <Link onClick={() => toggleDropdown()} to="/profile">
                                            <li className="px-4 py-2 text-primary list-none">
                                                <div className="flex items-center">
                                                    <img src={profile.image_profile ? `${API_BASE}${profile.image_profile}` : "/images/user.png"} alt="user profile" className="h-8 w-8 rounded-full bg-white/20 border border-white/40 object-cover inline-block mr-2" />
                                                    <span className="align-middle">{profile.username || "Guest"}</span>
                                                </div>
                                                <hr className="mt-3 border-slate-200 dark:border-slate-700" />
                                            </li>
                                        </Link>
                                        <Link onClick={() => toggleDropdown()} to="/mycourses">
                                            <li className="px-4 py-2 hover:bg-primary/10 dark:hover:bg-slate-700 cursor-pointer text-primary list-none">
                                                <span className="material-symbols-outlined text-sm mr-2 align-middle">Book</span>คอร์สของฉัน
                                            </li>
                                        </Link>
                                        <Link onClick={() => toggleDropdown()} to="/courses">
                                            <li className="px-4 py-2 hover:bg-primary/10 dark:hover:bg-slate-700 cursor-pointer text-primary list-none">
                                                <span className="material-symbols-outlined text-sm mr-2 align-middle">school</span>คอร์สทั้งหมด
                                            </li>
                                        </Link>
                                        {user?.roles?.includes("admin") && (
                                            <Link onClick={(e) => { toggleDropdown(); e.stopPropagation(); }} to="/admin">
                                                <li className="px-4 py-2 hover:bg-primary/10 dark:hover:bg-slate-700 cursor-pointer text-primary list-none">
                                                    <span className="material-symbols-outlined text-sm mr-2 align-middle">admin_panel_settings</span>Admin
                                                </li>
                                            </Link>
                                        )}
                                        <li className="px-4 py-2 hover:bg-primary/10 dark:hover:bg-slate-700 cursor-pointer text-primary list-none">
                                            <button onClick={handleLogout}>
                                                <span className="material-symbols-outlined text-sm mr-2 align-middle">logout</span>ออกจากระบบ
                                            </button>
                                        </li>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!user && (
                        <div className="flex items-center space-x-4 text-white font-medium">
                            <Link to="/login" className="hover:opacity-80 transition">เข้าสู่ระบบ</Link>
                            <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-xl font-bold hover:bg-opacity-90 transition">สมัครสมาชิก</Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Navbar;