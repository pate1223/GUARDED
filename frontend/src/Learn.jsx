import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
//import { getDirectedLearningModules, getCategoryContent } from "./utils/learnContent";

// Define view constants
const VIEWS = {
  ONLINE: "online-scams",
  CALL: "call-scams",
  EMAIL: "email-scams",
};

export default function Learn({ onBack, i18n, lang }) {
  const categories = [
    {
      id: "01",
      title: i18n(lang, "emailScamsTitle"),
      desc: i18n(lang, "spotPhishingEmails"),
      icon: "📧",
      view: VIEWS.EMAIL,
    },
    {
      id: "02",
      title: i18n(lang, "callScamsTitle"),
      desc: i18n(lang, "detectFakeTech"),
      icon: "📞",
      view: VIEWS.CALL,
    },
    {
      id: "03",
      title: i18n(lang, "onlineScamsTitle"),
      desc: i18n(lang, "identifyFakeWebsitesShort"),
      icon: "💻",
      view: VIEWS.ONLINE,
    },
  ];

  // Scam Learning Libraries (replaces learning paths)
  const categoryContent = useMemo(() => getCategoryContent(i18n, lang, VIEWS), [lang]);

  // Directed Learning Modules
  const directedLearningModules = useMemo(() => getDirectedLearningModules(i18n, lang), [lang]);

  // ---- State ----
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLearningChoice, setShowLearningChoice] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Directed Learning State
  const [showDirectedLearning, setShowDirectedLearning] = useState(false);
  const [directedLearningView, setDirectedLearningView] = useState("welcome"); // welcome, modules, lesson
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  const radius = 190; // px
  const angleStepDeg = 360 / categories.length;

  const prevCategory = () =>
    setActiveIndex((p) => (p === 0 ? categories.length - 1 : p - 1));
  const nextCategory = () =>
    setActiveIndex((p) => (p === categories.length - 1 ? 0 : p + 1));

  const activeCategory = categories[activeIndex].view;
  const { libraries, courses } = categoryContent[activeCategory];

  // Handle clicking on a learning library
  const handleLibraryClick = (lib) => {
    console.log("Opening library:", lib.title);
    alert(`Opening: ${lib.title}`); // temporary placeholder
  };

  // Directed Learning Helper Functions
  const startDirectedLearning = () => {
    setShowDirectedLearning(true);
    setDirectedLearningView("welcome");
  };

  const goToModules = () => {
    setDirectedLearningView("modules");
    setCurrentModule(null);
    setCurrentLesson(null);
  };

  const startModule = (module) => {
    setCurrentModule(module);
    setCurrentLesson(module.lessons[0]);
    setDirectedLearningView("lesson");
  };

  const goToNextLesson = () => {
    if (!currentModule || !currentLesson) return;

    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      // Mark current lesson as completed
      const lessonKey = `${currentModule.id}-${currentLesson.id}`;
      if (!completedLessons.includes(lessonKey)) {
        setCompletedLessons([...completedLessons, lessonKey]);
      }
      // Go to next lesson
      setCurrentLesson(currentModule.lessons[currentLessonIndex + 1]);
    } else {
      // Module completed, mark lesson as complete and go back to modules
      const lessonKey = `${currentModule.id}-${currentLesson.id}`;
      if (!completedLessons.includes(lessonKey)) {
        setCompletedLessons([...completedLessons, lessonKey]);
      }
      goToModules();
    }
  };

  const goToPreviousLesson = () => {
    if (!currentModule || !currentLesson) return;

    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentLessonIndex > 0) {
      setCurrentLesson(currentModule.lessons[currentLessonIndex - 1]);
    }
  };

  const isModuleUnlocked = (moduleId) => {
    if (moduleId === 1) return true; // First module always unlocked

    const previousModule = directedLearningModules.find(m => m.id === moduleId - 1);
    if (!previousModule) return false;

    // Check if all lessons in previous module are completed
    return previousModule.lessons.every(lesson =>
      completedLessons.includes(`${previousModule.id}-${lesson.id}`)
    );
  };

  const getModuleProgress = (module) => {
    const completedCount = module.lessons.filter(lesson =>
      completedLessons.includes(`${module.id}-${lesson.id}`)
    ).length;
    return Math.round((completedCount / module.lessons.length) * 100);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      {/* Video Modal */}
      {showVideoModal && selectedCourse && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowVideoModal(false);
            setSelectedCourse(null);
          }}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedCourse.title}</h2>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setSelectedCourse(null);
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 transition"
                aria-label="Close video"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Container */}
            <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
              {/* Placeholder for YouTube or other video embed */}
              <iframe
                className="absolute inset-0 w-full h-full"
                src={selectedCourse.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                title={`${selectedCourse.title} Video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700">
              <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
                {selectedCourse.desc}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
                {selectedCourse.level} • {selectedCourse.time}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowVideoModal(false);
                    setSelectedCourse(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold shadow-lg"
                >
                  {i18n(lang, "continueLearning")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Directed Learning Full-Screen Interface */}
      {showDirectedLearning && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#f5f3ff] to-white dark:from-gray-900 dark:to-gray-800 z-50 overflow-y-auto transition-colors duration-300">
          {/* Welcome View */}
          {directedLearningView === "welcome" && (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
              <div className="max-w-4xl text-center">
                <div className="mb-8 animate-bounce">
                  <span className="text-8xl">🎓</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-[#5c52ff] mb-6">
                  {i18n(lang, "welcomeDirected")}
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                  {i18n(lang, "structuredPath")}
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{i18n(lang, "whatYouLearn")}</h3>
                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">📧</span>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">Email Scams</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Identify phishing and fake emails</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">📞</span>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">Call Scams</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Detect fraudulent phone calls</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">💻</span>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">Online Scams</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Spot fake websites and offers</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={goToModules}
                    className="px-10 py-4 bg-gradient-to-r from-[#6a5cff] to-[#5c52ff] text-white text-xl font-semibold rounded-full hover:opacity-90 transition shadow-lg"
                  >
                    {i18n(lang, "startJourney")}
                  </button>
                  <button
                    onClick={() => setShowDirectedLearning(false)}
                    className="px-10 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xl font-semibold rounded-full hover:bg-gray-300 transition"
                  >
                    {i18n(lang, "back")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modules Overview */}
          {directedLearningView === "modules" && (
            <div className="min-h-screen px-6 py-16">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-5xl font-extrabold text-[#5c52ff] mb-4">
                    {i18n(lang, "yourLearningPath")}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {i18n(lang, "completeModules")}
                  </p>
                  <button
                    onClick={() => setShowDirectedLearning(false)}
                    className="mt-6 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-300 transition"
                  >
                    ← {i18n(lang, "backToChoice")}
                  </button>
                </div>

                <div className="space-y-8">
                  {directedLearningModules.map((module, index) => {
                    const unlocked = isModuleUnlocked(module.id);
                    const progress = getModuleProgress(module);
                    const isCompleted = progress === 100;

                    return (
                      <div
                        key={module.id}
                        className={`bg-white rounded-2xl p-8 shadow-lg transition-all ${
                          unlocked ? 'hover:shadow-xl cursor-pointer' : 'opacity-60'
                        } ${isCompleted ? 'border-4 border-green-400' : 'border-2 border-gray-200 dark:border-gray-700'}`}
                        onClick={() => unlocked && startModule(module)}
                      >
                        <div className="flex items-start gap-6">
                          <div className="text-6xl">{unlocked ? module.icon : '🔒'}</div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{module.title}</h3>
                              {isCompleted && <span className="text-2xl">✅</span>}
                            </div>
                            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                                {module.level}
                              </span>
                              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                                ⏱ {module.duration}
                              </span>
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                {module.lessons.length} {i18n(lang, "lessons")}
                              </span>
                            </div>

                            {/* Progress Bar */}
                            {unlocked && (
                              <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                  <span>{i18n(lang, "progress")}</span>
                                  <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-[#6a5cff] to-[#5c52ff] h-full rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Lessons List */}
                            <div className="grid md:grid-cols-3 gap-3">
                              {module.lessons.map((lesson) => {
                                const lessonCompleted = completedLessons.includes(`${module.id}-${lesson.id}`);
                                return (
                                  <div
                                    key={lesson.id}
                                    className={`text-sm p-3 rounded-lg ${
                                      lessonCompleted
                                        ? 'bg-green-50 border border-green-300'
                                        : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {lessonCompleted ? '✓' : '○'}
                                      <span className="font-medium">{lesson.title}</span>
                                    </div>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">{lesson.duration}</span>
                                  </div>
                                );
                              })}
                            </div>

                            {unlocked && !isCompleted && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startModule(module);
                                }}
                                className="mt-4 px-6 py-3 bg-gradient-to-r from-[#6a5cff] to-[#5c52ff] text-white font-semibold rounded-full hover:opacity-90 transition"
                              >
                                {progress > 0 ? i18n(lang, "continueModule") : i18n(lang, "startModule")}
                              </button>
                            )}

                            {!unlocked && (
                              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
                                🔒 {i18n(lang, "unlockPrevious")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Individual Lesson View */}
          {directedLearningView === "lesson" && currentModule && currentLesson && (
            <div className="min-h-screen px-6 py-16">
              <div className="max-w-5xl mx-auto">
                {/* Lesson Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
                  <button
                    onClick={goToModules}
                    className="text-[#5c52ff] hover:text-[#4335d1] font-semibold mb-4 flex items-center gap-2"
                  >
                    ← {i18n(lang, "backToModules")}
                  </button>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">
                        {currentModule.title}
                      </h3>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{currentLesson.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">⏱ {currentLesson.duration}</p>
                    </div>
                    <div className="text-5xl">{currentModule.icon}</div>
                  </div>

                  {/* Lesson Progress */}
                  <div className="mt-4">
                    <div className="flex gap-2">
                      {currentModule.lessons.map((lesson, idx) => (
                        <div
                          key={lesson.id}
                          className={`h-2 flex-1 rounded-full ${
                            completedLessons.includes(`${currentModule.id}-${lesson.id}`)
                              ? 'bg-green-400'
                              : lesson.id === currentLesson.id
                              ? 'bg-[#5c52ff]'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Lesson {currentModule.lessons.findIndex(l => l.id === currentLesson.id) + 1} of {currentModule.lessons.length}
                    </p>
                  </div>
                </div>

                {/* Video Container */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg mb-8">
                  <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={currentLesson.videoUrl}
                      title={currentLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{i18n(lang, "lessonOverview")}</h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {currentLesson.content}
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={goToPreviousLesson}
                    disabled={currentModule.lessons.findIndex(l => l.id === currentLesson.id) === 0}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← {i18n(lang, "previousLesson")}
                  </button>
                  <button
                    onClick={goToNextLesson}
                    className="px-8 py-3 bg-gradient-to-r from-[#6a5cff] to-[#5c52ff] text-white font-semibold rounded-full hover:opacity-90 transition shadow-lg"
                  >
                    {currentModule.lessons.findIndex(l => l.id === currentLesson.id) === currentModule.lessons.length - 1
                      ? `${i18n(lang, "completeModule")} →`
                      : `${i18n(lang, "nextLesson")} →`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-white to-[#f5f3ff] dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="flex flex-col items-center gap-y-8 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-extrabold text-[#5c52ff] leading-tight">
            {i18n(lang, "learnHowOutsmart")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl">
            {i18n(lang, "interactiveLessons")}
          </p>
          <button
            onClick={() => {
              setShowLearningChoice(true);
              setTimeout(() => {
                const section = document.getElementById("learning-choice");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }, 150);
            }}
            className="px-10 py-4 bg-[#5c52ff] text-white text-xl font-semibold rounded-full hover:bg-[#4335d1] flex items-center gap-3 transition"
          >
            {i18n(lang, "startLearning")}
            <span className="text-2xl">↗</span>
          </button>
        </div>
      </section>

      {/* Learning Mode Choice */}
      {showLearningChoice && (
        <section
          id="learning-choice"
          className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-6 py-16 transition-colors duration-300"
        >
          <div className="text-center mb-10">
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
              {i18n(lang, "chooseLearningMode")}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {i18n(lang, "pickLearningStyle")}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
            <button
              onClick={startDirectedLearning}
              className="px-10 py-6 bg-[#5c52ff] text-white text-2xl font-semibold rounded-full hover:bg-[#4335d1] transition"
            >
              {i18n(lang, "directedLearning")}
            </button>
            <button
              onClick={() => {
                const section = document.getElementById("categories");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-10 py-6 bg-gray-200 dark:bg-gray-700 text-[#5c52ff] text-2xl font-semibold rounded-full hover:bg-gray-300 transition"
            >
              {i18n(lang, "freeLearning")}
            </button>
          </div>
        </section>
      )}

      {/* Categories Wheel */}
      <section
        id="categories"
        className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-6 py-16 transition-colors duration-300"
      >
        <div className="text-center mb-10">
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
            {i18n(lang, "exploreCategories")}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {i18n(lang, "chooseScamType")}
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scam Learning Libraries */}
      <section id="libraries" className="w-full bg-gray-50 dark:bg-gray-900 py-20 transition-colors duration-300">
        <div className="bg-[#5c52ff] text-white text-center py-4 rounded-full mb-10 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold">
            {categories[activeIndex].title} {i18n(lang, "learningLibraries")}
          </h3>
        </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
  {libraries.map((lib, idx) => (
    <div
      key={idx}
      onClick={() => setSelectedLibrary(lib)} // 👈 open that library
      className="bg-white dark:bg-gray-800 border-2 border-[#5c52ff] dark:border-purple-500 rounded-2xl p-6 shadow hover:shadow-lg cursor-pointer transition flex flex-col items-center text-center"
    >
      <div className="text-6xl mb-4">{lib.icon}</div>
      <h4 className="text-lg font-bold mb-2">{lib.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{lib.desc}</p>
    </div>
  ))}
</div>

      </section>

      {/* Scam Courses */}
      <section id="courses" className="w-full bg-white dark:bg-gray-900 pt-20 pb-40 overflow-visible transition-colors duration-300">
        <div className="bg-[#5c52ff] text-white text-center py-4 rounded-full mb-10 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold">
            {categories[activeIndex].title} {i18n(lang, "courses")}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 border-2 border-[#5c52ff] dark:border-purple-500 rounded-2xl shadow hover:shadow-lg transition flex flex-col text-center overflow-hidden"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${course.image})` }}
              />
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-lg font-bold mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">{course.desc}</p>
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {course.level} • {course.time}
                </div>
                <div className="flex justify-center gap-4">
                  <button className="px-4 py-2 border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition">
                    {i18n(lang, "viewDetails")}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowVideoModal(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#6a5cff] to-[#5c52ff] text-white rounded-full hover:opacity-90 transition"
                  >
                    {i18n(lang, "start")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full bg-[#5c52ff] text-white py-6">
        <p className="text-center text-sm md:text-base font-semibold">
          2025 GuardEd. {i18n(lang, "allRightsReserved")}
        </p>
      </footer>
    </div>
  );
}