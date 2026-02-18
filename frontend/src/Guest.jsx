import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";


function Guest() {

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = () => {
        login();
        navigate("/home");
    };

    return (
        <>
            <div className="bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen">
                <nav className="sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div
                        className="bg-primary rounded-2xl shadow-lg px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="material-symbols-outlined text-white text-3xl">book_4</span>
                            <span className="text-white font-bold text-2xl tracking-tight">Learnaja</span>
                        </div>
                        <div className="hidden md:flex flex-1 max-w-xl mx-8">
                            <div className="relative w-full">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#fb90a9]">search</span>
                                <input className="w-full bg-white/20 border-none rounded-full py-2 pl-12 pr-4 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 transition-all" placeholder="Search for courses..." type="text" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-white font-semibold text-sm hover:opacity-80 transition"
                                 onClick={handleLogin}>Log In</button>
                            <button onClick={() => navigate("/register")} className="bg-white text-primary px-6 py-2 rounded-full font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
                               >Sign Up</button>
                        </div>
                    </div>
                </nav>
            </div>
            
        </>
    );
}

export default Guest;
