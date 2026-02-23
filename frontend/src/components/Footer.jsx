import { useState, useEffect } from "react";
import GitHubIcon from '@mui/icons-material/GitHub';

function Footer() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    darkMode ? html.classList.add("dark") : html.classList.remove("dark");
  }, [darkMode]);

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
    
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">
                book_4
              </span>
              <span className="text-slate-900 dark:text-white font-bold text-xl">
                Learnaja
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              ระบบการเรียนรู้ออนไลน์ที่มุ่งเน้นการพัฒนาทักษะและความรู้ในหลากหลายสาขา หลักสูตรที่ออกแบบโดยผู้เชี่ยวชาญและเนื้อหาที่ทันสมัย ช่วยให้คุณก้าวสู่ความสำเร็จในเส้นทางการเรียนรู้ของคุณได้อย่างมั่นใจ!
            </p>
          </div>

     
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6">Platform</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-primary" href="#">Courses</a></li>
              <li><a className="hover:text-primary" href="#">Mentors</a></li>
              <li><a className="hover:text-primary" href="#">Pricing</a></li>
              <li><a className="hover:text-primary" href="#">Certificates</a></li>
            </ul>
          </div>

     
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6">Support</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-primary" href="#">Help Center</a></li>
              <li><a className="hover:text-primary" href="#">Terms</a></li>
              <li><a className="hover:text-primary" href="#">Privacy</a></li>
              <li><a className="hover:text-primary" href="#">Contact</a></li>
            </ul>
          </div>

     
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6">Social</h5>
            <div className="flex space-x-4">
              <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border">
                <GitHubIcon className="text-slate-900 dark:text-white" /> 
              </div>
            
            </div>
          </div>
        </div>

    
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© 2024 Learnaja. All rights reserved.</p>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-sm">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
