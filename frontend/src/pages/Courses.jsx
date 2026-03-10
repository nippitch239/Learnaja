import { useContext, useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCourses } from "../services/fetchCourse";

function Courses() {
    const [searchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "ทั้งหมด");
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [sortBy, setSortBy] = useState("popular");

    const categories = [
        { name: "ทั้งหมด", icon: "grid_view" },
        { name: "Programming", icon: "code" },
        { name: "Design", icon: "palette" },
        { name: "Math", icon: "calculate" },
        { name: "Networking", icon: "network_check" },
        { name: "Data Science", icon: "bar_chart" },
        { name: "CyberSecurity", icon: "security" },
        { name: "Language", icon: "translate" }
    ];

    const sortOptions = [
        { value: "popular", label: "ยอดนิยม" },
        { value: "newest", label: "ใหม่ล่าสุด" },
        { value: "rating_asc", label: "คะแนน: ต่ำไปสูง" },
        { value: "rating_desc", label: "คะแนน: สูงไปต่ำ" },
        { value: "price_desc", label: "ราคา: สูงไปต่ำ" },
        { value: "price_asc", label: "ราคา: ต่ำไปสูง" },
    ];

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const query = selectedCategory === "ทั้งหมด" ? searchTerm : selectedCategory;
            loadCourses(query, sortBy);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedCategory, sortBy]);

    const loadCourses = async (search = "", sort = sortBy) => {
        try {
            setLoading(true);
            const data = await fetchCourses(search, sort);
            setCourses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName);
        setIsCategoryDropdownOpen(false);
        if (categoryName === "ทั้งหมด") {
            setSearchTerm("");
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className=" bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen">
            <main className=" pt-28 pb-12 max-w-7xl mx-auto px-4 lg:px-6">
                <div className="flex flex-col space-y-8">

                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 gap-4">

                        {/* Left: Category dropdown + Search */}
                        <div className="flex items-center space-x-4 w-full md:w-auto">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsCategoryDropdownOpen(o => !o)}
                                    className="flex items-center space-x-2 px-6 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-semibold text-sm"
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {categories.find(c => c.name === selectedCategory)?.icon ?? "grid_view"}
                                    </span>
                                    <span>{selectedCategory}</span>
                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                </button>

                                {isCategoryDropdownOpen && (
                                    <div className="absolute top-full mt-2 left-0 z-50 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg min-w-45">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.name}
                                                onClick={() => handleCategorySelect(cat.name)}
                                                className={`flex items-center space-x-2 w-full px-4 py-2.5 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 dark:rounded-2xl transition-colors cursor-pointer ${selectedCategory === cat.name ? "text-primary font-bold" : ""} dark:hover:text-primary`}
                                            >
                                                <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                                                <span>{cat.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Search */}
                            <div className="relative group w-full md:w-72">
                                <input
                                    type="text"
                                    placeholder="ค้นหาคอร์ส..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all font-medium text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">
                                    search
                                </span>
                            </div>
                        </div>

                        {/* Right: Sort */}
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="text-slate-400">เรียงตาม:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer p-0"
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold">คอร์สเรียนทั้งหมด</h1>
                        <p className="text-slate-400 text-sm">
                            {loading ? "กำลังโหลด..." : `แสดง ${courses.length} ผลลัพธ์`}
                        </p>
                    </div>

                    {/* Course Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse">
                                    <div className="h-48 bg-slate-200 dark:bg-slate-700" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                            <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                            <p className="text-lg font-medium">ไม่พบคอร์สที่ค้นหา</p>
                            <p className="text-sm mt-1">ลองใช้คำค้นหาอื่น หรือเลือกหมวดหมู่อื่น</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.map(course => (
                                <Link
                                    to={`/courses/${course.id}`}
                                    key={course.id}
                                    className="flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 group"
                                >
                                    <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        {course.thumbnail_url ? (
                                            <img
                                                src={course.thumbnail_url.startsWith("http") ? course.thumbnail_url : `${import.meta.env.VITE_API_URL || "http://localhost:3200"}${course.thumbnail_url}`}
                                                onError={(e) => { e.target.src = "/images/no-image.png"; }}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <img src="/images/no-image.png" alt="No thumbnail" className="w-full h-full object-cover" />
                                        )}
                                        {course.category && (
                                            <span className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                                                {course.category}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col flex-1 p-5">
                                        <h4 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                                            {course.description || "ไม่มีคำอธิบาย"}
                                        </p>

                                        <div className="flex items-center space-x-1 mb-4">
                                            <span className="material-symbols-outlined text-yellow-400 text-[18px]">star</span>
                                            <span className="font-bold text-sm">{course.rating?.toFixed(1) ?? "N/A"}</span>
                                            <span className="text-slate-400 text-sm">({course.rating_count ?? 0})</span>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-2xl font-black text-primary">{course.price ? `${course.price}P` : "ฟรี"}</span>
                                            <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white px-4 py-2 rounded-xl transition-all text-sm font-semibold">
                                                ดูรายละเอียด
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Courses;
