import { useState, useEffect } from "react";
import GitHubIcon from '@mui/icons-material/GitHub';

function Footer() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    darkMode ? html.classList.add("dark") : html.classList.remove("dark");
  }, [darkMode]);

  return (
      <footer className=" py-5 mx-auto px-20 dark:bg-slate-800 border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-50">
                <span
                    className="material-symbols-outlined text-primary">Book_4</span>
                <span className="font-bold text-lg tracking-tight dark:text-white">LearnNaja</span>
            </div>
            <div className=" border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 ">
              <p>© 2024 Learnaja. All rights reserved.</p>

              <button onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 ml-5">
                <span className="material-symbols-outlined text-sm">
                  {darkMode ? "light_mode" : "dark_mode"}
                </span>
              </button>
            </div>
    </footer>
    
  );
}

export default Footer;