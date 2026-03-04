import { useState } from "react";
import { Link } from "react-router-dom";
import CreateCourse from "./CreateCourse";
import AllCourse from "./AllCourse";
import AddPoints from "./AddPoints";
import Approve from "./Approve";

const menuItems = [
    { key: "create", label: "สร้างคอร์สเรียน", icon: "library_add", component: <CreateCourse /> },
    { key: "all", label: "คอร์สเรียนทั้งหมด", icon: "book_5", component: <AllCourse /> },
    { key: "points", label: "จัดการคะแนน", icon: "send_money", component: <AddPoints /> },
    { key: "approve", label: "อนุมัติผู้สอน", icon: "check_circle", component: <Approve /> },
];

function Admin() {
    const [activePage, setActivePage] = useState("create");

    const currentComponent = menuItems.find((m) => m.key === activePage)?.component;

    return (
        <>
            <div className="bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen">
                <main className="pt-28 pb-12 max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex flex-col lg:flex-row gap-8">

                        <aside className="w-full lg:w-64 shrink-0">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 sticky top-28">
                                <nav className="space-y-1">
                                    <div className="px-4 py-2 mb-2 text-[12px] font-bold text-slate-400 tracking-widest">โหมดผู้ดูแลระบบ</div>
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.key}
                                            onClick={() => setActivePage(item.key)}
                                            className={`cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left
                                        ${activePage === item.key
                                                    ? "bg-primary/10 text-primary font-semibold"
                                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </nav>
                                <div className="mt-6">
                                    <Link to="/" className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center space-x-2 w-full justify-center text-sm shadow-sm">
                                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                                        <span>กลับไปหน้าหลัก</span>
                                    </Link>
                                </div>
                            </div>
                        </aside>
                        <div className="container mx-auto px-4 pb-8">
                            <h1 className="text-2xl font-bold text-primary">{menuItems.find(m => m.key === activePage)?.label}</h1>
                            <hr className="border-gray-300 dark:border-gray-700 my-4" />
                            {currentComponent}
                        </div>
                    </div>
                </main >
                <hr className="border-gray-300 dark:border-gray-700 my-4" />
            </div>
        </>
    );
}

export default Admin;