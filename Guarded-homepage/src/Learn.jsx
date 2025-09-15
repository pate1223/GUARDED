import React from "react";

// Define view constants
const VIEWS = {
  ONLINE: "online-scams",
  CALL: "call-scams",
  EMAIL: "email-scams",
};

export default function Learn({ onBack, setView }) {
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

  const learningPaths = [
    {
      title: "Everyday Safety for Families",
      desc: "Learn how to protect your family from online and phone scams with simple steps.",
      lessons: 4,
      level: "Beginner",
      time: "25 mins total",
      image: "👨‍👩‍👧‍👦", // replace with illustration
    },
    {
      title: "Workplace Security Basics",
      desc: "Essential tips for employees to spot phishing and protect business data.",
      lessons: 5,
      level: "Beginner",
      time: "30 mins total",
      image: "💼",
    },
    {
      title: "Digital Safety for Seniors",
      desc: "Easy, step-by-step guides designed for parents and grandparents to stay safe online.",
      lessons: 3,
      level: "Beginner",
      time: "20 mins total",
      image: "👴",
    },
    {
      title: "Advanced Fraud Prevention",
      desc: "Train your team to recognize social engineering, data theft, and compliance risks.",
      lessons: 6,
      level: "Advanced",
      time: "45 mins total",
      image: "📊",
    },
  ];

  const courses = [
    {
      title: "Email Security Basics",
      desc: "Spot phishing emails, malicious links, and fake attachments.",
      level: "Beginner",
      time: "20 mins total",
      image: "/images/email-security.jpg", // swap with real image
      view: VIEWS.EMAIL,
    },
    {
      title: "Workplace Security Basics",
      desc: "Easy, step-by-step guides designed for parents and grandparents to stay safe online.",
      level: "Beginner",
      time: "15 mins total",
      image: "/images/workplace-security.jpg",
      view: VIEWS.CALL,
    },
    {
      title: "Digital Safety for Seniors",
      desc: "Easy, step-by-step guides designed for parents and grandparents to stay safe online.",
      level: "Intermediate",
      time: "25 mins total",
      image: "/images/digital-seniors.jpg",
      view: VIEWS.ONLINE,
    },
  ];

  return (
    <div className="w-screen min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-br from-white to-[#f5f3ff]">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#5c52ff] mb-6 leading-tight">
          Learn How to <br className="hidden md:block" /> Outsmart Scams
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
          Interactive lessons and short guides that teach you to recognize and
          prevent fraud.
        </p>
        <button
          onClick={() => {
            const section = document.getElementById("categories");
            if (section) {
              section.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="px-8 py-4 bg-[#5c52ff] text-white text-lg font-semibold rounded-full hover:bg-[#4335d1] flex items-center gap-2 transition"
        >
          Start Learning
          <span className="text-xl">↗</span>
        </button>
      </div>

      {/* Categories Section */}
      <section id="categories" className="w-full bg-white py-20">
        <h3 className="text-center text-gray-800 text-2xl italic font-light mb-12 tracking-wide">
          CATEGORIES ✦
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
          {/* Left Side Placeholder for Image */}
          <div className="w-64 h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
            [Image Placeholder]
          </div>

          {/* Categories side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setView(cat.view)}
                className="bg-[#e6e3ff] hover:bg-[#5c52ff] hover:text-white text-gray-800 rounded-xl p-6 shadow-md cursor-pointer transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <p className="text-sm font-light">{cat.id}</p>
                <h4 className="text-lg font-bold mb-2">{cat.title}</h4>
                <p className="text-sm">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Learning Paths */}
      <section id="featured-paths" className="w-full bg-gray-50 py-20">
        <div className="bg-[#5c52ff] text-white text-center py-4 rounded-t-full mb-10 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold">FEATURED LEARNING PATHS</h3>
        </div>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 px-6">
          Each learning path is designed to walk you step by step through
          real-world examples, safety tips, and quick exercises, so you can
          build confidence in spotting and preventing fraud.
        </p>

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
      <section id="courses" className="w-full bg-white py-20">
        <div className="bg-[#5c52ff] text-white text-center py-4 rounded-t-full mb-10 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold">COURSES</h3>
        </div>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 px-6">
          Short, practical courses designed to teach you one concept at a time,
          from spotting phishing emails to understanding compliance rules.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-[#5c52ff] rounded-2xl shadow hover:shadow-lg transition flex flex-col text-center overflow-hidden"
            >
              {/* Course image */}
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${course.image})` }}
              ></div>

              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-lg font-bold mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  {course.desc}
                </p>
                <div className="text-sm text-gray-700 mb-4">
                  {course.level} • {course.time}
                </div>
                <div className="flex justify-center gap-4">
                  <button className="px-4 py-2 border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition">
                    View Details
                  </button>
                  <button
                    onClick={() => setView(course.view)}
                    className="px-4 py-2 bg-gradient-to-r from-[#6a5cff] to-[#5c52ff] text-white rounded-full hover:opacity-90 transition"
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <div className="px-8 py-16 bg-gray-50 border-t border-gray-200">
        <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Additional Resources
        </h3>
        <ul className="space-y-4 text-lg text-[#5c52ff] text-center">
          <li>
            <a
              href="https://www.antifraudcentre-centreantifraude.ca/"
              target="_blank"
              rel="noreferrer"
            >
              Canadian Anti-Fraud Centre
            </a>
          </li>
          <li>
            <a
              href="https://www.consumer.ftc.gov/features/scam-alerts"
              target="_blank"
              rel="noreferrer"
            >
              FTC Scam Alerts
            </a>
          </li>
          <li>
            <a
              href="https://www.getcybersafe.gc.ca/en"
              target="_blank"
              rel="noreferrer"
            >
              Government of Canada: Get Cyber Safe
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
