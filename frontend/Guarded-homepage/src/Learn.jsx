import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define view constants
const VIEWS = {
  ONLINE: "online-scams",
  CALL: "call-scams",
  EMAIL: "email-scams",
};

export default function Learn({ onBack }) {
  const categories = [
    {
      id: "01",
      title: "Email Scams",
      desc: "Spot phishing emails and fake attachments.",
      icon: "📧",
      view: VIEWS.EMAIL,
    },
    {
      id: "02",
      title: "Call Scams",
      desc: "Detect fake tech support and suspicious phone calls.",
      icon: "📞",
      view: VIEWS.CALL,
    },
    {
      id: "03",
      title: "Online Scams",
      desc: "Identify fake websites, phishing links, and fraudulent offers.",
      icon: "💻",
      view: VIEWS.ONLINE,
    },
  ];

  // Sample placeholder content for each category
  const categoryContent = {
    [VIEWS.EMAIL]: {
      learningPaths: [
        {
          title: "Recognizing Phishing Emails",
          desc: "Learn the red flags of phishing attempts.",
          lessons: 3,
          level: "Beginner",
          time: "20 mins total",
          image: "📨",
        },
        {
          title: "Avoiding Malicious Attachments",
          desc: "Practical tips to handle suspicious files.",
          lessons: 4,
          level: "Beginner",
          time: "30 mins total",
          image: "📎",
        },
      ],
      courses: [
        {
          title: "Email Security Basics",
          desc: "Spot phishing emails, malicious links, and fake attachments.",
          level: "Beginner",
          time: "20 mins total",
          image: "/images/email-security.jpg",
        },
      ],
    },
    [VIEWS.CALL]: {
      learningPaths: [
        {
          title: "Phone Scam Awareness",
          desc: "Recognize common phone scam tactics.",
          lessons: 2,
          level: "Beginner",
          time: "15 mins total",
          image: "📞",
        },
        {
          title: "Protecting Elderly from Call Scams",
          desc: "Guides for families to safeguard seniors.",
          lessons: 3,
          level: "Beginner",
          time: "25 mins total",
          image: "👴",
        },
      ],
      courses: [
        {
          title: "Call Scam Safety Basics",
          desc: "Spot fake tech support and suspicious phone calls.",
          level: "Beginner",
          time: "15 mins total",
          image: "/images/workplace-security.jpg",
        },
      ],
    },
    [VIEWS.ONLINE]: {
      learningPaths: [
        {
          title: "Safe Online Shopping",
          desc: "How to identify safe vs fake e-commerce sites.",
          lessons: 4,
          level: "Beginner",
          time: "30 mins total",
          image: "🛒",
        },
        {
          title: "Social Media Security",
          desc: "Avoid scams across social platforms.",
          lessons: 5,
          level: "Intermediate",
          time: "35 mins total",
          image: "💻",
        },
      ],
      courses: [
        {
          title: "Online Scam Detection",
          desc: "Learn how to spot fake websites and fraudulent offers.",
          level: "Intermediate",
          time: "25 mins total",
          image: "/images/digital-seniors.jpg",
        },
      ],
    },
  };

  // ---- Wheel state ----
  const [activeIndex, setActiveIndex] = useState(0);
  const radius = 190; // px
  const angleStepDeg = 360 / categories.length;

  const prevCategory = () =>
    setActiveIndex((p) => (p === 0 ? categories.length - 1 : p - 1));
  const nextCategory = () =>
    setActiveIndex((p) => (p === categories.length - 1 ? 0 : p + 1));

  const activeCategory = categories[activeIndex].view;
  const { learningPaths, courses } = categoryContent[activeCategory];

  return (
    <div className="w-screen min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-white to-[#f5f3ff]">
        <div className="flex flex-col items-center gap-y-8 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-extrabold text-[#5c52ff] leading-tight">
            Learn How to <br className="hidden md:block" /> Outsmart Scams
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl">
            Interactive lessons and short guides that teach you to recognize, avoid,
            and prevent fraud in everyday life.
          </p>
          <button
            onClick={() => {
              const section = document.getElementById("categories");
              if (section) section.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-10 py-4 bg-[#5c52ff] text-white text-xl font-semibold rounded-full hover:bg-[#4335d1] flex items-center gap-3 transition"
          >
            Start Learning
            <span className="text-2xl">↗</span>
          </button>
        </div>
      </section>

      {/* Categories Wheel */}
      <section
        id="categories"
        className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-16"
      >
        <div className="text-center mb-10">
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Explore Categories
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pick a category. The active card is highlighted; others fade behind it.
          </p>
        </div>

        <div className="relative w-[560px] h-[560px]">
          {/* Arrows */}
          <button
            aria-label="Previous category"
            onClick={prevCategory}
            className="absolute -left-20 top-1/2 -translate-y-1/2 z-30 bg-[#5c52ff] text-white p-3 rounded-full shadow hover:bg-[#4335d1] transition"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            aria-label="Next category"
            onClick={nextCategory}
            className="absolute -right-20 top-1/2 -translate-y-1/2 z-30 bg-[#5c52ff] text-white p-3 rounded-full shadow hover:bg-[#4335d1] transition"
          >
            <ChevronRight size={22} />
          </button>

          {/* Cards */}
          <div className="relative w-full h-full">
            {categories.map((cat, index) => {
              const theta = (index - activeIndex) * angleStepDeg;
              const transform = `rotate(${theta}deg) translateY(-${radius}px) rotate(${-theta}deg)`;
              const isActive = index === activeIndex;

              return (
                <div
                  key={cat.id}
                  onClick={() => setActiveIndex(index)}
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                    w-72 h-72 rounded-2xl p-6 shadow-lg cursor-pointer
                    transition-[transform,opacity,background-color,box-shadow] duration-500 ease-out
                    flex flex-col`}
                  style={{
                    transform,
                    zIndex: isActive ? 20 : 5,
                    backgroundColor: isActive ? "#5c52ff" : "rgba(92,82,255,0.1)",
                    color: isActive ? "#ffffff" : "rgba(0,0,0,0.45)",
                    opacity: isActive ? 1 : 0.55,
                    boxShadow: isActive
                      ? "0 25px 40px rgba(92,82,255,0.35)"
                      : "0 10px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <p className="text-sm font-light">{cat.id}</p>
                  <h4 className="text-2xl font-extrabold mt-1 mb-3">{cat.title}</h4>
                  <p className="text-sm leading-relaxed flex-grow">{cat.desc}</p>
                  <div className="text-4xl mt-4">{cat.icon}</div>
                  {isActive && (
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          const section = document.getElementById("featured-paths");
                          if (section) section.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="px-4 py-2 bg-white text-[#5c52ff] rounded-full font-semibold hover:bg-[#f0efff] transition"
                      >
                        View Content
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

{/* Featured Learning Paths */}
<section id="featured-paths" className="w-full bg-gray-50 py-20">
  <div className="bg-[#5c52ff] text-white text-center py-4 rounded-full mb-10 max-w-5xl mx-auto">
    <h3 className="text-2xl font-bold">
      {categories[activeIndex].title} Learning Paths
    </h3>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
    {learningPaths.map((path, idx) => (
      <div
        key={idx}
        className="bg-white border-2 border-[#5c52ff] rounded-2xl p-6 shadow hover:shadow-lg transition flex flex-col items-center text-center"
      >
        <h4 className="text-lg font-bold mb-2">{path.title}</h4>
        <p className="text-sm text-gray-600 mb-4">{path.desc}</p>
        <div className="text-6xl mb-4">{path.image}</div>
        <div className="text-sm text-gray-700 mb-4">
          {path.lessons} lessons • {path.level} • {path.time}
        </div>
        <button className="px-5 py-2 border border-gray-800 rounded-full hover:bg-[#5c52ff] hover:text-white transition">
          View Path
        </button>
      </div>
    ))}
  </div>
</section>

{/* Courses Section */}
<section
  id="courses"
  className="w-full bg-white pt-20 pb-40 overflow-visible"
>

  <div className="bg-[#5c52ff] text-white text-center py-4 rounded-full mb-10 max-w-5xl mx-auto">
    <h3 className="text-2xl font-bold">
      {categories[activeIndex].title} Courses
    </h3>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
    {courses.map((course, idx) => (
      <div
        key={idx}
        className="bg-white border-2 border-[#5c52ff] rounded-2xl shadow hover:shadow-lg transition flex flex-col text-center overflow-hidden"
      >
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${course.image})` }}
        />
        <div className="p-6 flex flex-col flex-grow">
          <h4 className="text-lg font-bold mb-2">{course.title}</h4>
          <p className="text-sm text-gray-600 mb-4 flex-grow">{course.desc}</p>
          <div className="text-sm text-gray-700 mb-4">
            {course.level} • {course.time}
          </div>
          <div className="flex justify-center gap-4">
            <button className="px-4 py-2 border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition">
              View Details
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-[#6a5cff] to-[#5c52ff] text-white rounded-full hover:opacity-90 transition">
              Start
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
<footer className="w-full bg-[#5c52ff] text-white py-6">
  <p className="text-center text-sm md:text-base font-semibold">
    2025 GuardEd. All rights reserved
  </p>
</footer>
  </div>
  );
}
