function Lesson() {
    function playVideo() {
        const thumbnail = document.getElementById('video-thumbnail');
        const iframe = document.getElementById('yt-iframe');
        const wrapper = document.getElementById('video-wrapper');

        // Load iframe src (triggers video load + autoplay)
        iframe.src = iframe.dataset.src;

        // Fade out thumbnail, reveal iframe
        thumbnail.style.opacity = '0';
        thumbnail.style.pointerEvents = 'none';
        iframe.classList.remove('opacity-0', 'pointer-events-none');
        iframe.classList.add('opacity-100');

        // Remove click handler so it doesn't interfere
        wrapper.onclick = null;
        wrapper.style.cursor = 'default';
    }

    const toggleModule = (btn) => {
        const items = btn.nextElementSibling;
        const isOpen = items.classList.contains('open');

        document.querySelectorAll('.module-items').forEach(el => el.classList.remove('open'));
        document.querySelectorAll('.module-toggle').forEach(el => {
            el.classList.remove('is-open');
            el.style.background = '';
        });

        if (!isOpen) {
            items.classList.add('open');
            btn.classList.add('is-open');
        }
    }
    return (
        <>
            <div className=" bg-main bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100">
                <main class="flex-1 flex overflow-hidden relative p-4 gap-4 bg-slate-50">

                    {/* ─── Sidebar ─── */}
                    <aside id="lesson-sidebar"
                        class="w-72.5 bg-white rounded-3xl border border-slate-200 flex flex-col h-full overflow-hidden shrink-0 shadow-sm transition-all duration-300">

                        <div class="p-5 border-b border-slate-100">
                            <div class="flex items-center justify-between mb-3">
                                <h2 class="font-bold text-sm text-slate-800 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-lg text-primary">list_alt</span>
                                    รายละเอียดบทเรียน
                                </h2>
                                <span class="text-[11px] font-bold px-2 py-0.5 rounded-full text-primary bg-primary/50">8%</span>
                            </div>
                            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full w-[8%] rounded-full" style="background:linear-gradient(90deg,var(--primary-dark),var(--primary))"></div>
                            </div>
                        </div>

                        <div class="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-1">

                            {/* Pre-test */}
                            <button class="w-full flex items-center gap-2 px-3 py-2.5 mb-1 rounded-xl text-left border cursor-pointer transition-colors"
                                style="background:#fff5f8;border-color:#ffd6e0;color:var(--primary-dark)"
                                onmouseover="this.style.background='#ffe4ec'" onmouseout="this.style.background='#fff5f8'">
                                <span class="material-symbols-outlined text-sm">quiz</span>
                                <span class="text-[11px] font-bold uppercase tracking-wider">แบบทดสอบก่อนเรียน</span>
                            </button>

                            {/* <!-- Chapter 1 (ACTIVE) --> */}
                            <div class="module">
                                <button class="module-toggle bg-pink-200 is-open w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-colors"
                                    onclick={(e) => toggleModule(e.currentTarget)}>
                                    <span class="material-symbols-outlined text-sm chevron text-pink-600">expand_more</span>
                                    <span class="text-[11px] font-bold uppercase tracking-wider text-pink-600">
                                        บทที่ 1: ทำความรู้จักกับ React
                                    </span>
                                </button>
                                <div class="module-items open mt-1 ml-3 pl-3 border-l-2 border-primary">
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
                                        <span class="material-symbols-outlined text-sm text-emerald-500">check_circle</span>
                                        <span>1. React คืออะไร และทำไมต้องใช้?</span>
                                    </div>
                                    {/* Current lesson  */}
                                    <div class="lesson-current relative flex items-center gap-2 pl-4 pr-2.5 py-2 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer"
                                        style="background:var(--primary-light)">
                                        <span class="material-symbols-outlined text-sm text-pink-600" >play_circle</span>
                                        <span>2. ติดตั้งและตั้งค่า Project แรก</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span class="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>3. โครงสร้างโปรเจกต์ React</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span class="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>4. JSX คืออะไร และวิธีใช้งาน</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer mt-1 transition-colors"
                                        style="color:var(--primary-dark);background:#fff5f8"
                                        onmouseover="this.style.background='#ffe4ec'" onmouseout="this.style.background='#fff5f8'">
                                        <span class="material-symbols-outlined text-sm">quiz</span>
                                        <span>Checkpoint Quiz 1</span>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Chapter 2 --> */}
                            <div class="module">
                                <button class="module-toggle w-full flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors"
                                    onclick="toggleModule(this)">
                                    <span class="material-symbols-outlined text-sm text-slate-400 chevron">expand_more</span>
                                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        บทที่ 2: React Core
                                    </span>
                                </button>
                                <div class="module-items mt-1 ml-3 pl-3 border-l-2 border-slate-100">
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span class="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>1. Component และ Props</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span class="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>2. State และ useState Hook</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span class="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>3. Event Handling ใน React</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span class="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>4. Conditional Rendering</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span class="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>5. Lists และ Keys</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span class="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>6. useEffect และ Lifecycle</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer mt-1 opacity-40"
                                        style="color:var(--primary-dark);background:#fff5f8">
                                        <span class="material-symbols-outlined text-sm">quiz</span>
                                        <span>Checkpoint Quiz 2</span>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Chapter 3 --> */}
                            <div class="module">
                                <button class="module-toggle w-full flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors"
                                    onclick="toggleModule(this)">
                                    <span class="material-symbols-outlined text-sm text-slate-400 chevron">expand_more</span>
                                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        บทที่ 3: Advanced Hooks
                                    </span>
                                </button>
                                <div class="module-items mt-1 ml-3 pl-3 border-l-2 border-slate-100">
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span class="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>1. Understanding useMemo</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span class="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>2. Custom Hooks Logic</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 cursor-default">
                                        <span class="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                                        <span>3. UseReducer Deep Dive</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer mt-1 opacity-40"
                                        style="color:var(--primary-dark);background:#fff5f8">
                                        <span class="material-symbols-outlined text-sm">quiz</span>
                                        <span>Checkpoint Quiz 3</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="p-4 border-t border-slate-100">
                            <button class="w-full py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm hover:bg-slate-800 transition-all">
                                <span class="material-symbols-outlined text-sm">arrow_back</span>
                                <span>Back to Course</span>
                            </button>
                        </div>
                    </aside>

                    {/* <!-- ─── Content Area ─── --> */}
                    <div id="content-wrapper"
                        class="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        <div class="flex-1 overflow-y-auto custom-scrollbar">

                            {/* <!-- Sticky topbar --> */}
                            <div class="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-8 py-5 flex items-center gap-4 border-b border-slate-100">
                                <label for="sidebar-toggle"
                                    class="flex items-center justify-center w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all text-slate-500 shrink-0 shadow-sm">
                                    <span class="material-symbols-outlined text-xl transition-all duration-300" id="toggle-icon">side_navigation</span>
                                </label>
                                <div>
                                    <nav class="flex items-center space-x-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        <span>Module 1</span>
                                        <span class="material-symbols-outlined text-xs">chevron_right</span>
                                        <span style="color:var(--primary-dark)">Lesson 2</span>
                                    </nav>
                                    <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">ติดตั้งและตั้งค่า Project แรก</h1>
                                </div>
                            </div>

                            {/* <!-- Body --> */}
                            <div class="max-w-3xl mx-auto w-full px-8 py-10">

                                {/* <!-- Video --> */}
                                <div id="video-wrapper" class="rounded-3xl overflow-hidden shadow-xl border border-slate-100 aspect-video relative group mb-12 bg-slate-900 cursor-pointer" onclick="playVideo()">
                                    {/* <!-- Thumbnail --> */}
                                    <div id="video-thumbnail" class="absolute inset-0 z-10 transition-opacity duration-300">
                                        <img alt="Lesson Thumbnail" class="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
                                            src="https://img.youtube.com/vi/MpFCUprXFwQ/maxresdefault.jpg" />
                                        <div class="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                            <button class="w-20 h-20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
                                                style="background:rgba(249,168,186,0.92)">
                                                <span class="material-symbols-outlined text-5xl">play_circle</span>
                                            </button>
                                            <span class="text-white text-xs font-semibold bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">คลิกเพื่อเล่นวิดีโอ</span>
                                        </div>
                                    </div>
                                    {/* <!-- YouTube iframe --> */}
                                    <iframe id="yt-iframe"
                                        class="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
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
                                    <header class="mb-10">
                                        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                                            เริ่มต้น React ใน 5 นาที
                                        </h2>
                                        <div class="h-1.5 w-12 rounded-full" style="background:linear-gradient(90deg,var(--primary-dark),var(--primary))"></div>
                                    </header>

                                    <p class="text-base leading-relaxed text-slate-600 mb-10">
                                        ก่อนจะเริ่มเขียน React ได้ เราต้องตั้งค่า Development Environment ให้พร้อมก่อน บทเรียนนี้จะพาทุกคนตั้งแต่ติดตั้ง Node.js ไปจนถึงสร้างและรัน React Project แรกของคุณได้สำเร็จ
                                    </p>

                                    {/* <!-- Step cards --> */}
                                    <div class="space-y-4 mb-10">

                                        {/* <!-- Step 1 --> */}
                                        <div class="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-pink-100 hover:bg-pink-50/30 transition-colors">
                                            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm" style="background:var(--primary-dark)">1</div>
                                            <div>
                                                <h4 class="font-bold text-sm text-slate-800 mb-1">ติดตั้ง Node.js</h4>
                                                <p class="text-xs text-slate-500 leading-relaxed">ดาวน์โหลด Node.js เวอร์ชัน LTS ล่าสุดจาก <span class="font-semibold text-slate-700">nodejs.org</span> แล้วติดตั้งตามขั้นตอน ตรวจสอบด้วยคำสั่ง <code class="bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded font-bold">node -v</code> ใน Terminal</p>
                                            </div>
                                        </div>

                                        {/* <!-- Step 2 --> */}
                                        <div class="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-pink-100 hover:bg-pink-50/30 transition-colors">
                                            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm" style="background:var(--primary-dark)">2</div>
                                            <div>
                                                <h4 class="font-bold text-sm text-slate-800 mb-1">สร้าง Project ด้วย Vite</h4>
                                                <p class="text-xs text-slate-500 leading-relaxed mb-2">รันคำสั่งด้านล่างใน Terminal เพื่อสร้าง React Project ใหม่ พร้อม TypeScript support</p>
                                                <div class="bg-slate-900 text-emerald-400 rounded-xl px-4 py-3 font-mono text-xs tracking-wide">npm create vite@latest my-app -- --template react</div>
                                            </div>
                                        </div>

                                        {/* <!-- Step 3 --> */}
                                        <div class="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-pink-100 hover:bg-pink-50/30 transition-colors">
                                            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm" style="background:var(--primary-dark)">3</div>
                                            <div>
                                                <h4 class="font-bold text-sm text-slate-800 mb-1">ติดตั้ง Dependencies และรัน</h4>
                                                <p class="text-xs text-slate-500 leading-relaxed mb-2">เข้าไปที่โฟลเดอร์ Project แล้วติดตั้ง packages และเริ่มรัน dev server</p>
                                                <div class="bg-slate-900 text-emerald-400 rounded-xl px-4 py-3 font-mono text-xs tracking-wide space-y-1">
                                                    <div>cd my-app</div>
                                                    <div>npm install</div>
                                                    <div>npm run dev</div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                    <div class="rounded-3xl p-7 mb-10 border" style="background:var(--primary-light);border-color:rgba(249,168,186,0.3)">
                                        <h3 class="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                                            <span class="material-symbols-outlined" style="color:var(--primary-dark)">tips_and_updates</span>
                                            สิ่งที่ควรรู้ก่อนเริ่ม
                                        </h3>
                                        <ul class="space-y-4 list-none pl-0 mb-0">
                                            <li class="flex items-start space-x-3">
                                                <span class="material-symbols-outlined bg-white shadow-sm p-1.5 rounded-xl text-base mt-0.5" style="color:var(--primary-dark)">verified</span>
                                                <span class="text-sm text-slate-600">
                                                    <strong class="text-slate-900">Node.js ≥ 18:</strong>
                                                    Vite และ React 18 ต้องการ Node.js เวอร์ชัน 18 ขึ้นไป ตรวจสอบให้ดีก่อนติดตั้ง
                                                </span>
                                            </li>
                                            <li class="flex items-start space-x-3">
                                                <span class="material-symbols-outlined bg-white shadow-sm p-1.5 rounded-xl text-base mt-0.5" style="color:var(--primary-dark)">verified</span>
                                                <span class="text-sm text-slate-600">
                                                    <strong class="text-slate-900">ใช้ VS Code:</strong>
                                                    แนะนำให้ติดตั้ง Extension <code class="bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-md font-bold text-xs">ES7+ React Snippets</code> และ <code class="bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-md font-bold text-xs">Prettier</code> เพื่อประสบการณ์ที่ดีขึ้น
                                                </span>
                                            </li>
                                            <li class="flex items-start space-x-3">
                                                <span class="material-symbols-outlined bg-white shadow-sm p-1.5 rounded-xl text-base mt-0.5" style="color:var(--primary-dark)">verified</span>
                                                <span class="text-sm text-slate-600">
                                                    <strong class="text-slate-900">Dev Server:</strong>
                                                    หลังรัน <code class="bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-md font-bold text-xs">npm run dev</code> เปิด Browser ที่ <code class="bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-md font-bold text-xs">http://localhost:5173</code> จะเห็นหน้า React แรกของคุณ
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <h3 class="text-xl font-bold text-slate-900 mb-4">โครงสร้างไฟล์ที่สำคัญ</h3>
                                    <p class="text-slate-600 mb-6 leading-relaxed text-sm">
                                        หลังสร้าง Project เสร็จ จะมีไฟล์สำคัญที่ต้องทำความเข้าใจ ได้แก่ <code class="bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-md font-bold text-xs">src/main.jsx</code> (entry point), <code class="bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-md font-bold text-xs">src/App.jsx</code> (root component) และ <code class="bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-md font-bold text-xs">index.html</code> (HTML template หลัก)
                                    </p>

                                    {/* Prev / Next */}
                                    <div class="mt-16 pt-10 border-t border-slate-100 flex items-center justify-between">
                                        <div class="group flex items-center gap-4 cursor-pointer">
                                            <div class="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-pink-300 group-hover:text-pink-400 group-hover:bg-pink-50 transition-all duration-300">
                                                <span class="material-symbols-outlined text-xl">arrow_back</span>
                                            </div>
                                            <div>
                                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Previous</span>
                                                <h4 class="text-sm font-bold text-slate-700 group-hover:text-pink-500 transition-colors">1. React คืออะไร และทำไมต้องใช้?</h4>
                                            </div>
                                        </div>
                                        <div class="group flex items-center gap-4 text-right cursor-pointer">
                                            <div>
                                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Next</span>
                                                <h4 class="text-sm font-bold text-slate-700 group-hover:text-pink-500 transition-colors">3. โครงสร้างโปรเจกต์ React</h4>
                                            </div>
                                            <div class="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all duration-300"
                                                style="background:var(--primary-dark)">
                                                <span class="material-symbols-outlined text-xl">arrow_forward</span>
                                            </div>
                                        </div>
                                    </div>
                                </article>


                            </div>
                        </div>
                    </div>
style
                </main>
            </div>
        </>
    )
}

export default Lesson;