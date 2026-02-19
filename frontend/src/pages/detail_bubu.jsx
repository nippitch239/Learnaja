import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import api from "../services/api";


function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isowner, setIsOwner] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse();
    fetchIsOwner();
  }, []);

  useEffect(() => {
    if (isowner) {
      navigate(`/courses/${id}`);
    }
  }, [isowner]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      console.log(res.data)
      setCourse(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const fetchIsOwner = async () => {
    try {
      const res = await api.get(`/courses/${id}/owner`);
      setIsOwner(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuy = async () => {
    try {

      if (isowner) {
        return;
      }

      const res = await api.post(`/courses/${id}/buy`);
      setIsOwner(true);
      setMessage(res.data.message);

    } catch (err) {
      console.error(err);
      setMessage(err.response.data.message);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const handleEdit = async () => {
    navigate(`/courses/${id}/edit`);
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="  bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 bg-main">
      
      <div className="pt-24 pb-12 hero-pattern dark:hero-pattern border-b border-pink-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-8">
              <Link to="/courses"><button className="flex items-center space-x-2 text-primary font-bold dark:text-yellow-400 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
                <span>ย้อนกลับ</span>
              </button></Link>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                  <div className="max-w-3xl space-y-4">
                      <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                          {course.title}</h1>
                          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            {course.description}</p>
                  </div>
                  <div className="flex flex-col items-start lg:items-end gap-4 min-w-70">
                     <div className="flex items-baseline space-x-2">
                          <span className="text-4xl font-black text-primary">{course.price}P</span>
                      </div>
                            <div className="flex gap-3 w-full">
                                <button
                                    className="flex-1 bg-primary text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 dark:shadow-none hover:-translate-y-0.5 transition-all">
                                    Enroll Now
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-3xl border border-white dark:border-slate-700">
                        <div className="flex items-center space-x-3">
                            <span
                                className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">schedule</span>
                            <div>
                                <p
                                    className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Duration</p>
                                <p className="font-bold text-sm">24.5 Hours</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span
                                className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">bar_chart</span>
                            <div>
                                <p
                                    className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Level</p>
                                <p className="font-bold text-sm">Intermediate</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span
                                className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">language</span>
                            <div>
                                <p
                                    className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Language</p>
                                <p className="font-bold text-sm">English</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span
                                className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">grade</span>
                            <div>
                                <p
                                    className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Rating</p>
                                <p className="font-bold text-sm">4.9 <span
                                        className="text-slate-400 font-medium">(12k+)</span></p>
                            </div>
                        </div>
                        <div
                            className="hidden lg:flex items-center space-x-3 border-l border-pink-100 dark:border-slate-700 pl-6">
                            <span
                                className="material-symbols-outlined text-primary p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">workspace_premium</span>
                            <div>
                                <p
                                    className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Certification</p>
                                <p className="font-bold text-sm">Included</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <main className="max-w-7xl mx-auto px-6 py-12">
            <div className="space-y-12">
                <section
                    className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-2xl font-bold mb-6">What you will learn</h3>
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                        <div className="flex items-start space-x-3">
                            <span
                                className="material-symbols-outlined text-green-500">check_circle</span>
                            <span
                                className="text-slate-600 dark:text-slate-400 text-sm">Master
                                React fundamentals and Advanced Hooks (useState,
                                useEffect, useMemo)</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span
                                className="material-symbols-outlined text-green-500">check_circle</span>
                            <span
                                className="text-slate-600 dark:text-slate-400 text-sm">Architect
                                large scale applications using Redux Toolkit and
                                Context API</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span
                                className="material-symbols-outlined text-green-500">check_circle</span>
                            <span
                                className="text-slate-600 dark:text-slate-400 text-sm">Implement
                                robust Routing with React Router v6.4+</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span
                                className="material-symbols-outlined text-green-500">check_circle</span>
                            <span
                                className="text-slate-600 dark:text-slate-400 text-sm">Build
                                high-performance web apps with Next.js 14 App
                                Router</span>
                        </div>
                    </div>
                </section>
                <section>
                    <div
                        className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-3xl font-bold">Course
                                    Content</h3>
                                <span className="text-lg font-bold text-primary">65%
                                    Complete</span>
                            </div>
                            <div
                                className="w-full h-3 bg-pink-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all duration-1000 w-[65%]"></div>
                            </div>
                            <p className="text-slate-500 mt-3 text-sm">12 Sections •
                                84 Lectures • 24h 12m total length</p>
                        </div>
                        <button
                            className="text-primary font-bold hover:underline self-start md:self-auto pb-1">Expand
                            all sections</button>
                    </div>
                    <div className="space-y-4">
                        <div
                            className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm opacity-75">
                            <button
                                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <span
                                        className="material-symbols-outlined text-green-500 fill-1">check_circle</span>
                                    <span
                                        className="text-lg font-bold text-slate-500">Introduction
                                        to React &amp; Modern Web
                                        Ecosystem</span>
                                </div>
                                <span
                                    className="text-sm text-slate-400 font-medium">4
                                    lectures • 45 min</span>
                            </button>
                        </div>
                        <div
                            className="bg-white dark:bg-surface-dark border-2 border-primary/20 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md">
                            <button
                                className="w-full flex items-center justify-between p-6 bg-pink-50/30 dark:bg-slate-800/50">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="relative w-6 h-6 flex items-center justify-center">
                                        <svg
                                            className="absolute inset-0 w-full h-full -rotate-90">
                                            <circle
                                                className="text-pink-100 dark:text-slate-700"
                                                cx="12" cy="12"
                                                fill="transparent" r="10"
                                                stroke="currentColor"
                                                stroke-width="3"></circle>
                                            <circle className="text-primary" cx="12"
                                                cy="12" fill="transparent"
                                                r="10" stroke="currentColor"
                                                stroke-dasharray="62.8"
                                                stroke-dashoffset="35"
                                                stroke-linecap="round"
                                                stroke-width="3"></circle>
                                        </svg>
                                        <span
                                            className="material-symbols-outlined text-[14px] text-primary">play_arrow</span>
                                    </div>
                                    <span className="text-lg font-bold">React
                                        Basics: Components, Props, and
                                        State</span>
                                </div>
                                <span
                                    className="text-sm text-slate-400 font-medium">12
                                    lectures • 3h 15min</span>
                            </button>
                            <div
                                className="p-6 space-y-6 border-t border-pink-100 dark:border-slate-800">
                                <div
                                    className="flex items-center justify-between group opacity-60">
                                    <div className="flex items-center space-x-4">
                                        <span
                                            className="material-symbols-outlined text-green-500 fill-1">check_circle</span>
                                        <div className="cursor-pointer">
                                            <span
                                                className="text-base font-medium line-through decoration-slate-300">Understanding
                                                JSX and the Virtual DOM</span>
                                            <p
                                                className="text-xs text-slate-400 mt-0.5">Start
                                                here to understand how React
                                                really works under the hood.</p>
                                        </div>
                                    </div>
                                    <span
                                        className="text-sm text-slate-400 font-mono">15:00</span>
                                </div>
                                <div
                                    className="flex items-center justify-between group">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className="relative w-6 h-6 flex items-center justify-center">
                                            <svg
                                                className="absolute inset-0 w-full h-full -rotate-90">
                                                <circle
                                                    className="text-slate-100 dark:text-slate-700"
                                                    cx="12" cy="12"
                                                    fill="transparent" r="10"
                                                    stroke="currentColor"
                                                    stroke-width="3"></circle>
                                                <circle className="text-primary"
                                                    cx="12" cy="12"
                                                    fill="transparent" r="10"
                                                    stroke="currentColor"
                                                    stroke-dasharray="62.8"
                                                    stroke-dashoffset="25"
                                                    stroke-linecap="round"
                                                    stroke-width="3"></circle>
                                            </svg>
                                        </div>
                                        <div className="cursor-pointer">
                                            <span
                                                className="text-base font-bold text-primary group-hover:text-primary transition-colors">Functional
                                                Components vs className
                                                Components</span>
                                            <p
                                                className="text-xs text-slate-400 mt-0.5">Why
                                                the industry shifted to
                                                functional components and
                                                hooks.</p>
                                        </div>
                                    </div>
                                    <span
                                        className="text-sm text-primary font-mono font-bold">Resume</span>
                                </div>
                                <div
                                    className="flex items-center justify-between group">
                                    <div className="flex items-center space-x-4">
                                        <span
                                            className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">play_circle</span>
                                        <div className="cursor-pointer">
                                            <span
                                                className="text-base font-medium group-hover:text-primary transition-colors">Coding
                                                Exercise: Your First
                                                Component</span>
                                            <p
                                                className="text-xs text-slate-400 mt-0.5">Build
                                                a small profile card component
                                                using props.</p>
                                        </div>
                                    </div>
                                    <span
                                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold uppercase text-slate-500">Practice</span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            <button
                                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <span
                                        className="material-symbols-outlined text-slate-400">play_circle</span>
                                    <span className="text-lg font-bold">Deep Dive
                                        into React Hooks</span>
                                </div>
                                <span
                                    className="text-sm text-slate-400 font-medium">8
                                    lectures • 2h 20min</span>
                            </button>
                        </div>
                        <div
                            className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            <button
                                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <span
                                        className="material-symbols-outlined text-slate-400">play_circle</span>
                                    <span className="text-lg font-bold">State
                                        Management with Redux Toolkit</span>
                                </div>
                                <span
                                    className="text-sm text-slate-400 font-medium">10
                                    lectures • 4h 05min</span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>
  );
}

export default CourseDetail;
