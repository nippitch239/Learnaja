import { Link } from "react-router-dom";
import { useState, useRef } from "react";
function Lesson() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openModule, setOpenModule] = useState(0); // index ของ module ที่เปิดอยู่
    const [videoPlaying, setVideoPlaying] = useState(false);
    const iframeRef = useRef(null);

    const toggleModule = (index) => {
        setOpenModule(prev => prev === index ? null : index);
    };

    const playVideo = () => {
        setVideoPlaying(true);
        if (iframeRef.current) {
            iframeRef.current.src = "https://www.youtube.com/embed/MpFCUprXFwQ?si=3mnpo8U5VN_PAuRG&autoplay=1";
        }
    };

    return (
        <>
            <div className=" bg-main bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                <main className="pt-24 flex-3 flex overflow-hidden relative p-4 gap-4 max-w-7xl mx-auto md:px-6">

                    {/* ─── Sidebar ─── */}
                    <aside id="lesson-sidebar"
                        className={`w-72.5 bg-white rounded-3xl border border-slate-200 flex flex-col h-full overflow-hidden shrink-0 shadow-sm transition-all duration-300 ${!sidebarOpen ? 'hidden' : ''} dark:bg-slate-800 dark:border-slate-700`}>
                            <div className="p-5 border-b border-slate-100">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2 dark:text-slate-200">
                                    <span className="material-symbols-outlined text-lg text-primary">list_alt</span>
                                    รายละเอียดบทเรียน
                                </h2>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-primary bg-primary/20">8%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-[8%] rounded-full bg-primary"></div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-1">

                            {/* Pre-test */}
                            <button className="w-full flex items-center gap-2 px-3 py-2.5 mb-1 rounded-xl text-left border cursor-pointer transition-colors bg-primary/10 border-pink-200 text-primary-dark font-medium"
                                onmouseover="this.style.background='#ffe4ec'" onmouseout="this.style.background='#fff5f8'">
                                <span className="material-symbols-outlined text-sm">quiz</span>
                                <span className="text-[11px] font-bold uppercase tracking-wider">แบบทดสอบก่อนเรียน</span>
                            </button>

                            {/* <!-- Chapter 1 (ACTIVE) --> */}
                            <div className="module">
                                <button className="module-toggle bg-primary/20 is-open w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-colors"
                                    onClick={() => toggleModule(0)}>
                                    <span className="material-symbols-outlined text-sm text-primary-dark">expand_more</span>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary-dark">
                                        บทที่ 1: ทำความรู้จักกับ React
                                    </span>
                                </button>
                                <div className={`module-items mt-1 ml-3 pl-3 border-l-2 border-slate-200 ${openModule === 0 ? 'open' : 'hidden'}`}>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
                                        <span className="material-symbols-outlined text-sm text-emerald-500">check_circle</span>
                                        <span>1. React คืออะไร และทำไมต้องใช้?</span>
                                    </div>

                                    <div className="lesson-current relative flex items-center gap-2 pl-4 pr-2.5 py-2 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer bg-primary/20 dark:bg-primary/20 border border-primary/50 dark:text-slate-400"
                                        >
                                        <span className="material-symbols-outlined text-sm text-primary-dark" >play_circle</span>
                                        <span>2. ติดตั้งและตั้งค่า Project แรก</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>3. โครงสร้างโปรเจกต์ React</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>4. JSX คืออะไร และวิธีใช้งาน</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer mt-1 transition-colors text-primary-dark bg-primary/10 dark:bg-primary/10"
                                        onMouseOver={(e) => e.currentTarget.style.background = '#ffe4ec'}
                                        onMouseOut={(e) => e.currentTarget.style.background = '#fff5f8'}>
                                        <span className="material-symbols-outlined text-sm">quiz</span>
                                        <span>Checkpoint Quiz 1</span>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Chapter 2 --> */}
                            <div className="module">
                                <button className="module-toggle w-full flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors"
                                    onClick={() => toggleModule(1)}>
                                    <span className="material-symbols-outlined text-sm text-slate-400 chevron">expand_more</span>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        บทที่ 2: React Core
                                    </span>
                                </button>
                                <div className={`module-items mt-1 ml-3 pl-3 border-l-2 border-slate-100 ${openModule === 1 ? 'open' : 'hidden'}`}>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>1. Component และ Props</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>2. State และ useState Hook</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>3. Event Handling ใน React</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>4. Conditional Rendering</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>5. Lists และ Keys</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>6. useEffect และ Lifecycle</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer mt-1 opacity-40 text-primary-dark bg-primary/10">
                                        <span className="material-symbols-outlined text-sm">quiz</span>
                                        <span>Checkpoint Quiz 2</span>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Chapter 3 --> */}
                            <div className="module">
                                <button className="module-toggle w-full flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors"
                                    onClick={() => toggleModule(2)}>
                                    <span className="material-symbols-outlined text-sm text-slate-400 chevron">expand_more</span>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        บทที่ 3: Advanced Hooks
                                    </span>
                                </button>
                                <div className={`module-items mt-1 ml-3 pl-3 border-l-2 border-slate-100 ${openModule === 2 ? 'open' : 'hidden'}`}>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>1. Understanding useMemo</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>2. Custom Hooks Logic</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>3. UseReducer Deep Dive</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer mt-1 opacity-40 text-primary-dark bg-primary/10">
                                        <span className="material-symbols-outlined text-sm">quiz</span>
                                        <span>Checkpoint Quiz 3</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="p-4 border-t border-slate-100">
                            <Link to="/MyDetailCourse">
                            </Link>
                            <button className="w-full py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm hover:bg-slate-800 transition-all dark:hover:bg-slate-700">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                <span>กลับสู่หน้าคอร์ส</span>
                            </button>
                        </div>
                    </aside>

                    {/* <!-- ─── Content Area ─── --> */}
                    <div id="content-wrapper"
                        className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm dark:bg-slate-800 dark:border-slate-700">
                        <div className="flex-1 overflow-y-auto custom-scrollbar">

                            {/* <!-- Sticky topbar --> */}
                            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-8 py-5 flex items-center gap-4 border-b border-slate-100 dark:bg-slate-900/80 dark:border-slate-700">
                                <button onClick={() => setSidebarOpen(prev => !prev)}
                                    className="flex items-center justify-center w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all text-slate-500 shrink-0 shadow-sm">
                                    <span className="material-symbols-outlined text-xl transition-all duration-300" id="toggle-icon">side_navigation</span>
                                </button>
                                <div>
                                    <nav className="flex items-center space-x-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        <span>Module 1</span>
                                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                                        <span className="text-primary-dark dark:text-primary-light">Lesson 2</span>
                                    </nav>
                                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight dark:text-slate-100">ติดตั้งและตั้งค่า Project แรก</h1>
                                </div>
                            </div>

                            {/* <!-- Body --> */}
                            <div className="max-w-3xl mx-auto w-full px-8 py-10">

                                {/* <!-- Video --> */}
                                <div id="video-wrapper" className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 aspect-video relative group mb-12 bg-slate-900 cursor-pointer" onClick={playVideo}>
                                    {/* <!-- Thumbnail --> */}
                                    <div id="video-thumbnail" className={`absolute inset-0 z-10 transition-opacity duration-300 ${videoPlaying ? 'hidden' : ''}`}>
                                        <img alt="Lesson Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
                                            src="https://img.youtube.com/vi/MpFCUprXFwQ/maxresdefault.jpg" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                            <button className="w-20 h-20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl bg-primary/100/90">
                                                <span className="material-symbols-outlined text-5xl">play_circle</span>
                                            </button>
                                            <span className="text-white text-xs font-semibold bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">คลิกเพื่อเล่นวิดีโอ</span>
                                        </div>
                                    </div>
                                    {/* <!-- YouTube iframe --> */}
                                    <iframe ref={iframeRef} id="yt-iframe"
                                        className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${videoPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                        src=""
                                        data-src="https://www.youtube.com/embed/MpFCUprXFwQ?si=3mnpo8U5VN_PAuRG&autoplay=1"
                                        title="YouTube video player"
                                        frameborder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerpolicy="strict-origin-when-cross-origin"
                                        allowfullscreen>
                                    </iframe>
                                </div>

                                {/* <!-- Article --> */}
                                <article>
                                    <header className="mb-10">
                                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 dark:text-slate-100">
                                            เริ่มต้น React ใน 5 นาที
                                        </h2>
                                        <div className="h-1.5 w-12 rounded-full bg-linear-to-r from-pink-500 to-purple-500"></div>
                                    </header>

                                    <p className="text-base leading-relaxed text-slate-600 mb-10 dark:text-slate-400">
                                        ก่อนจะเริ่มเขียน React ได้ เราต้องตั้งค่า Development Environment ให้พร้อมก่อน บทเรียนนี้จะพาทุกคนตั้งแต่ติดตั้ง Node.js ไปจนถึงสร้างและรัน React Project แรกของคุณได้สำเร็จ
                                    </p>

                                    {/* <!-- Step cards --> */}
                                    <div className="space-y-4 mb-10">

                                        {/* <!-- Step 1 --> */}
                                        <div className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-pink-100 hover:bg-primary/10/30 transition-colors dark:bg-slate-700/30 dark:border-slate-600">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm bg-primary-dark">1</div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-800 mb-1 dark:text-slate-100">ติดตั้ง Node.js</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed">ดาวน์โหลด Node.js เวอร์ชัน LTS ล่าสุดจาก <span className="font-semibold text-slate-700 dark:text-slate-300">nodejs.org</span> แล้วติดตั้งตามขั้นตอน ตรวจสอบด้วยคำสั่ง <code className="bg-pink-100 text-primary-dark px-1.5 py-0.5 rounded font-bold dark:bg-pink-900/30 dark:text-pink-200">node -v</code> ใน Terminal</p>
                                            </div>
                                        </div>

                                        {/* <!-- Step 2 --> */}
                                        <div className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-pink-100 hover:bg-primary/10/30 transition-colors dark:bg-slate-700/30 dark:border-slate-600">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm bg-primary-dark">2</div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-800 mb-1 dark:text-slate-100">สร้าง Project ด้วย Vite</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed mb-2">รันคำสั่งด้านล่างใน Terminal เพื่อสร้าง React Project ใหม่ พร้อม TypeScript support</p>
                                                <div className="bg-slate-900 text-emerald-400 rounded-xl px-4 py-3 font-mono text-xs tracking-wide">npm create vite@latest my-app -- --template react</div>
                                            </div>
                                        </div>

                                        {/* <!-- Step 3 --> */}
                                        <div className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-pink-100 hover:bg-primary/10/30 transition-colors dark:bg-slate-700/30 dark:border-slate-600">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm bg-primary-dark">3</div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-800 mb-1 dark:text-slate-100">ติดตั้ง Dependencies และรัน</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed mb-2">เข้าไปที่โฟลเดอร์ Project แล้วติดตั้ง packages และเริ่มรัน dev server</p>
                                                <div className="bg-slate-900 text-emerald-400 rounded-xl px-4 py-3 font-mono text-xs tracking-wide space-y-1">
                                                    <div>cd my-app</div>
                                                    <div>npm install</div>
                                                    <div>npm run dev</div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                    <div className="rounded-3xl p-7 mb-10 border bg-primary/10 border-pink-200 dark:bg-primary/20 dark:border-pink-700">
                                        <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2 dark:text-slate-100" >
                                            <span className="material-symbols-outlined text-primary-dark">tips_and_updates</span>
                                            สิ่งที่ควรรู้ก่อนเริ่ม
                                        </h3>
                                        <ul className="space-y-4 list-none pl-0 mb-0">
                                            <li className="flex items-start space-x-3">
                                                <span className="material-symbols-outlined bg-white shadow-sm p-1.5 rounded-xl text-base mt-0.5 text-primary-dark">verified</span>
                                                <span className="text-sm text-slate-600 dark:text-slate-300">
                                                    <strong className="text-slate-900 dark:text-slate-100">Node.js ≥ 18:</strong>
                                                    Vite และ React 18 ต้องการ Node.js เวอร์ชัน 18 ขึ้นไป ตรวจสอบให้ดีก่อนติดตั้ง
                                                </span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <span className="material-symbols-outlined bg-white shadow-sm p-1.5 rounded-xl text-base mt-0.5 text-primary-dark">verified</span>
                                                <span className="text-sm text-slate-600 dark:text-slate-300">
                                                    <strong className="text-slate-900 dark:text-slate-100">ใช้ VS Code:</strong>
                                                    แนะนำให้ติดตั้ง Extension <code className="bg-pink-100 text-primary-dark px-1.5 py-0.5 rounded-md font-bold text-xs dark:bg-pink-900/30 dark:text-pink-200">ES7+ React Snippets</code> และ <code className="bg-pink-100 text-primary-dark px-1.5 py-0.5 rounded-md font-bold text-xs dark:bg-pink-900/30 dark:text-pink-200">Prettier</code> เพื่อประสบการณ์ที่ดีขึ้น
                                                </span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <span className="material-symbols-outlined bg-white shadow-sm p-1.5 rounded-xl text-base mt-0.5 text-primary-dark">verified</span>
                                                <span className="text-sm text-slate-600 dark:text-slate-300">
                                                    <strong className="text-slate-900 dark:text-slate-100">Dev Server:</strong>
                                                    หลังรัน <code className="bg-pink-100 text-primary-dark px-1.5 py-0.5 rounded-md font-bold text-xs dark:bg-pink-900/30 dark:text-pink-200">npm run dev</code> เปิด Browser ที่ <code className="bg-pink-100 text-primary-dark px-1.5 py-0.5 rounded-md font-bold text-xs dark:bg-pink-900/30 dark:text-pink-200">http://localhost:5173</code> จะเห็นหน้า React แรกของคุณ
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-4 dark:text-slate-100">โครงสร้างไฟล์ที่สำคัญ</h3>
                                    <p className="text-slate-600 mb-6 leading-relaxed text-sm dark:text-slate-300">
                                        หลังสร้าง Project เสร็จ จะมีไฟล์สำคัญที่ต้องทำความเข้าใจ ได้แก่ <code className="bg-pink-100 text-primary-dark px-1.5 py-0.5 rounded-md font-bold text-xs dark:bg-pink-900/30 dark:text-pink-200">src/main.jsx</code> (entry point), <code className="bg-pink-100 text-primary-dark px-1.5 py-0.5 rounded-md font-bold text-xs dark:bg-pink-900/30 dark:text-pink-200">src/App.jsx</code> (root component) และ <code className="bg-pink-100 text-primary-dark px-1.5 py-0.5 rounded-md font-bold text-xs dark:bg-pink-900/30 dark:text-pink-200">index.html</code> (HTML template หลัก)
                                    </p>

                                    {/* Prev / Next */}
                                    <div className="mt-16 pt-10 border-t border-slate-100 flex items-center justify-between">
                                        <div className="group flex items-center gap-4 cursor-pointer">
                                            <div className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-pink-300 group-hover:text-pink-400 group-hover:bg-primary/10 transition-all duration-300">
                                                <span className="material-symbols-outlined text-xl">arrow_back</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Previous</span>
                                                <h4 className="text-sm font-bold text-slate-700 group-hover:text-primary-dark transition-colors dark:text-slate-300">1. React คืออะไร และทำไมต้องใช้?</h4>
                                            </div>
                                        </div>
                                        <div className="group flex items-center gap-4 text-right cursor-pointer">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Next</span>
                                                <h4 className="text-sm font-bold text-slate-700 group-hover:text-primary-dark transition-colors dark:text-slate-300">3. โครงสร้างโปรเจกต์ React</h4>
                                            </div>
                                            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all duration-300 bg-primary-dark group-hover:bg-pink-700">
                                                <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default Lesson;