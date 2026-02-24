import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCourses } from "../services/fetchCourse";

function Courses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [sortBy, setSortBy] = useState("popular");

    const categories = [
        { name: "ทั้งหมด", icon: "grid_view" },
        { name: "Programming", icon: "code" },
        { name: "Design", icon: "palette" },
        { name: "Business", icon: "business" },
        { name: "Networking", icon: "network_check" },
        { name: "Data Science", icon: "data_object" },
        { name: "Health & Wellness", icon: "health_and_safety" },
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

    if (loading && searchTerm === "" && selectedCategory === "ทั้งหมด") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
            <main className="pt-28 pb-12 max-w-7xl mx-auto px-4 lg:px-6 text-slate-800 dark:text-slate-100">
                <div className="flex flex-col space-y-8">
                    {/* Search & Filter Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 gap-4">
                        <div className="flex items-center space-x-4 w-full md:w-auto">
                            <div className="relative">
                                <button
                                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl transition-all font-bold text-sm ${selectedCategory !== "ทั้งหมด"
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {categories.find(c => c.name === selectedCategory)?.icon || "grid_view"}
                                    </span>
                                    <span>{selectedCategory === "ทั้งหมด" ? "หมวดหมู่" : selectedCategory}</span>
                                    <span className={`material-symbols-outlined text-sm transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>

                                {isCategoryDropdownOpen && (
                                    <div className="absolute left-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.name}
                                                onClick={() => handleCategorySelect(cat.name)}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-bold transition-colors text-left ${selectedCategory === cat.name
                                                    ? "text-primary bg-primary/5"
                                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                                                <span>{cat.name}</span>
                                                {selectedCategory === cat.name && <span className="material-symbols-outlined text-sm ml-auto">check_circle</span>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* <button className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity font-semibold text-sm">
                                <span className="material-symbols-outlined text-xl">tune</span>
                                <span>ฟิลเตอร์</span>
                            </button> */}
                            <div className="relative w-full md:w-96 group">
                                <input
                                    type="text"
                                    placeholder="Search by title or category..."
                                    className="w-full pl-12 pr-6 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="hidden sm:flex items-center space-x-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">แท็กยอดนิยม :</span>
                                <div className="flex space-x-2">
                                    {["React", "Python", "UI Design"].map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSearchTerm(tag)}
                                            className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${searchTerm === tag
                                                ? "bg-primary text-white"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-primary/10 hover:text-primary"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-slate-400">เรียงตาม:</span>
                                <select
                                    className="bg-transparent border-none font-bold text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer p-0"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="popular">ยอดนิยม</option>
                                    <option value="newest">ใหม่ล่าสุด</option>
                                    <option value="rating_asc">คะแนน: ต่ำไปสูง</option>
                                    <option value="rating_desc">คะแนน: สูงไปต่ำ</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold">คอร์สเรียนทั้งหมด</h1>
                        <p className="text-slate-400 text-sm">แสดง {courses.length} ผลลัพธ์</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <div key={n} className="animate-pulse bg-white dark:bg-slate-900 h-80 rounded-3xl border border-slate-100 dark:border-slate-800"></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {courses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {courses.map((course) => (

                                        <div onClick={() => navigate(`/courses/${course.id}`)} key={course.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 group h-full flex flex-col">
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    src={course.thumbnail_url || "/images/user.png"}
                                                    onError={(e) => { e.target.src = "/images/user.png"; }}
                                                />
                                                {course.category && (
                                                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-bold rounded-lg shadow-sm">
                                                        {course.category}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-5 flex flex-col grow">
                                                <h4 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                    {course.title}
                                                </h4>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                                                    {course.description || "No description available."}
                                                </p>

                                                <div className="mt-auto">
                                                    <div className="flex items-center space-x-1 mb-4">
                                                        <span className="material-symbols-outlined text-yellow-400 text-[18px] fill-[1]">star</span>
                                                        <span className="font-bold text-sm">{(course.rating || 0).toFixed(1)}</span>
                                                        <span className="text-slate-400 text-sm">({course.rating_count > 1000 ? (course.rating_count / 1000).toFixed(1) + 'k' : course.rating_count || 0})</span>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex flex-col">
                                                            <span className="text-2xl font-black text-primary">
                                                                {course.price === 0 ? "FREE" : `${course.price}P`}
                                                            </span>
                                                        </div>
                                                        <Link
                                                            to={`/courses/${course.id}`}
                                                            className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl transition-all font-semibold text-sm"
                                                        >
                                                            ดูรายละเอียด
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
                                    <p className="text-slate-500 font-medium">ไม่พบคอร์สที่คุณค้นหา</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {courses.length > 0 && (
                                <div className="mt-12 flex justify-center space-x-2">
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md">1</button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:text-primary transition-colors">2</button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:text-primary transition-colors">3</button>
                                    <span className="w-10 h-10 flex items-center justify-center text-slate-400">...</span>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:text-primary transition-colors">12</button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Courses;
