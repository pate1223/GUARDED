import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, Play, Lock, CheckCircle, BookOpen, Video, Zap } from "lucide-react";
// Assuming this utility is correctly defined in ./utils/learnContent
import { getDirectedLearningModules, getCategoryContent } from "./utils/learnContent"; 

// Define view constants
const VIEWS = {
  ONLINE: "online-scams",
  CALL: "call-scams",
  EMAIL: "email-scams",
};

export default function Learn({ onBack, i18n, lang }) {
  const categories = [
    { id: "01", title: i18n(lang, "emailScamsTitle"), desc: i18n(lang, "spotPhishingEmails"), icon: "📧", view: VIEWS.EMAIL },
    { id: "02", title: i18n(lang, "callScamsTitle"), desc: i18n(lang, "detectFakeTech"), icon: "📞", view: VIEWS.CALL },
    { id: "03", title: i18n(lang, "onlineScamsTitle"), desc: i18n(lang, "identifyFakeWebsitesShort"), icon: "💻", view: VIEWS.ONLINE },
  ];

  // Memoized Content
  const categoryContent = useMemo(() => getCategoryContent(i18n, lang, VIEWS), [lang]);
  const directedLearningModules = useMemo(() => getDirectedLearningModules(i18n, lang), [lang]);

  // --- Main Flow State ---
  const [screen, setScreen] = useState("hero"); // hero, mode, free
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0); // For Free Flow - Initialized to the first category

  // --- Free Learning Modal State ---
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // --- Directed Learning State ---
  const [showDirectedLearning, setShowDirectedLearning] = useState(false); // full-screen overlay
  const [directedLearningView, setDirectedLearningView] = useState("welcome"); // welcome, modules, lesson
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]); // Array of module-id-lesson-id strings

  // --- Computed Values ---
  const currentCategory = categories[activeCategoryIndex].view;
  const { libraries, courses } = categoryContent[currentCategory] || { libraries: [], courses: [] }; // Safety check

  // --- Directed Learning Helpers (Omitting detailed implementation for brevity, assuming existing logic) ---

  const openDirectedLearning = () => {
    setShowDirectedLearning(true);
    setDirectedLearningView("welcome");
    setCurrentModule(null);
    setCurrentLesson(null);
  };

  const goToModules = () => {
    setDirectedLearningView("modules");
    setCurrentModule(null);
    setCurrentLesson(null);
  };

  const startModule = (module) => {
    setCurrentModule(module);
    const firstUncompletedLesson = module.lessons.find(
        (l) => !completedLessons.includes(`${module.id}-${l.id}`)
    );
    setCurrentLesson(firstUncompletedLesson || module.lessons[0]);
    setDirectedLearningView("lesson");
  };

  const goToNextLesson = () => {
    if (!currentModule || !currentLesson) return;
    const lessonKey = `${currentModule.id}-${currentLesson.id}`;
    if (!completedLessons.includes(lessonKey)) {
        setCompletedLessons((prev) => [...prev, lessonKey]);
    }
    const currentLessonIndex = currentModule.lessons.findIndex(
        (l) => l.id === currentLesson.id
    );

    if (currentLessonIndex < currentModule.lessons.length - 1) {
        setCurrentLesson(currentModule.lessons[currentLessonIndex + 1]);
    } else {
        setDirectedLearningView("modules");
        setCurrentModule(null);
        setCurrentLesson(null);
    }
  };

  const goToPreviousLesson = () => {
    if (!currentModule || !currentLesson) return;
    const currentLessonIndex = currentModule.lessons.findIndex(
        (l) => l.id === currentLesson.id
    );
    if (currentLessonIndex > 0) {
        setCurrentLesson(currentModule.lessons[currentLessonIndex - 1]);
    }
  };

  const isModuleUnlocked = (moduleId) => {
    if (moduleId === 1) return true;
    const previousModule = directedLearningModules.find(
        (m) => m.id === moduleId - 1
    );
    if (!previousModule) return false;
    return previousModule.lessons.every((lesson) =>
        completedLessons.includes(`${previousModule.id}-${lesson.id}`)
    );
  };

  const getModuleProgress = (module) => {
    const completedCount = module.lessons.filter((lesson) =>
        completedLessons.includes(`${module.id}-${lesson.id}`)
    ).length;
    return Math.round((completedCount / module.lessons.length) * 100);
  };


  // --- Render Functions (Simplified for context) ---

  const renderVideoModal = () => {
    // ... (Video Modal content remains the same) ...
    if (!showVideoModal || !selectedCourse) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
        onClick={() => {
          setShowVideoModal(false);
          setSelectedCourse(null);
        }}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden transform scale-100 transition-transform duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {selectedCourse.title}
            </h2>
            <button
              onClick={() => {
                setShowVideoModal(false);
                setSelectedCourse(null);
              }}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition p-1 rounded-full hover:bg-white/50"
              aria-label="Close video"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Video Container */}
          <div className="relative bg-black" style={{ paddingBottom: "56.25%" }}>
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
          <div className="p-6 bg-gray-50 dark:bg-gray-700 flex flex-col items-center">
            <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
              {selectedCourse.desc}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4 font-semibold">
              {selectedCourse.level} • {selectedCourse.time}
            </p>
            <button
              onClick={() => {
                setShowVideoModal(false);
                setSelectedCourse(null);
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition font-semibold"
            >
              {i18n(lang, "continueLearning")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDirectedLearningOverlay = () => {
    // ... (Directed Learning Overlay content remains the same) ...
    const isLessonView = directedLearningView === "lesson" && currentModule && currentLesson;
    const isModulesView = directedLearningView === "modules";
    const isWelcomeView = directedLearningView === "welcome";

    return (
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          showDirectedLearning ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Dimmed background */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setShowDirectedLearning(false)}
        />

        {/* Slide-in panel (100% width) */}
        <div
          className={`absolute inset-y-0 right-0 w-full bg-gradient-to-br from-white to-[#f5f3ff] dark:from-gray-900 dark:to-gray-800 shadow-2xl transform transition-transform duration-500 ${
            showDirectedLearning ? "translate-x-0" : "translate-x-full"
          } overflow-y-auto`}
        >
          {/* Directed Learning: Welcome View */}
          {isWelcomeView && (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
              <div className="max-w-4xl text-center">
                <div className="mb-8">
                  <span className="text-8xl">🎓</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                  {i18n(lang, "welcomeDirected")}
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                  {i18n(lang, "structuredPath")}
                </p>
                {/* Simplified What You Learn Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-10 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {i18n(lang, "whatYouLearn")}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-start gap-3">
                        <span className="text-3xl">{cat.icon}</span>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">{cat.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={goToModules}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-semibold rounded-full hover:opacity-90 transition shadow-lg"
                  >
                    {i18n(lang, "startJourney")}
                  </button>
                  <button
                    onClick={() => setShowDirectedLearning(false)}
                    className="px-10 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xl font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    {i18n(lang, "back")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Directed Learning: Modules Overview */}
          {isModulesView && (
            <div className="min-h-screen px-6 py-16">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                    {i18n(lang, "yourLearningPath")}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {i18n(lang, "completeModules")}
                  </p>
                  <button
                    onClick={() => setShowDirectedLearning(false)}
                    className="mt-6 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center mx-auto"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> {i18n(lang, "backToChoice")}
                  </button>
                </div>

                <div className="space-y-8">
                  {directedLearningModules.map((module) => {
                    const unlocked = isModuleUnlocked(module.id);
                    const progress = getModuleProgress(module);
                    const isCompleted = progress === 100;

                    return (
                      <div
                        key={module.id}
                        className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transition-all border-4 ${
                          unlocked
                            ? "hover:shadow-xl cursor-pointer hover:border-blue-300 dark:hover:border-purple-600"
                            : "opacity-60 cursor-not-allowed border-gray-100 dark:border-gray-700"
                        } ${isCompleted ? "border-green-400" : ""}`}
                        onClick={() => unlocked && startModule(module)}
                      >
                        <div className="flex items-start gap-6">
                          <div className="text-6xl text-blue-600 dark:text-purple-400">
                            {unlocked ? module.icon : <Lock className="w-12 h-12" />}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {module.title}
                              </h3>
                              {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
                            </div>
                            
                            {/* Metadata */}
                            <div className="flex flex-wrap gap-3 text-sm mb-4">
                              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                                {module.level}
                              </span>
                              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                ⏱ {module.duration}
                              </span>
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
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
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Action Button */}
                            {unlocked && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startModule(module);
                                }}
                                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:opacity-90 transition shadow-md"
                              >
                                {progress === 100
                                  ? i18n(lang, "reviewModule")
                                  : progress > 0
                                  ? i18n(lang, "continueModule")
                                  : i18n(lang, "startModule")}
                              </button>
                            )}

                            {!unlocked && (
                              <p className="mt-4 text-base text-red-500 dark:text-red-400 italic font-medium">
                                <Lock className="inline w-4 h-4 mr-1 mb-0.5" /> {i18n(lang, "unlockPrevious")}
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

          {/* Directed Learning: Individual Lesson View */}
          {isLessonView && (
            <div className="min-h-screen px-6 py-16">
              <div className="max-w-5xl mx-auto">
                {/* Lesson Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={goToModules}
                    className="text-blue-600 dark:text-purple-400 hover:text-blue-500 font-semibold mb-4 flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> {i18n(lang, "backToModules")}
                  </button>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-1">
                        {i18n(lang, "module")}: {currentModule.title}
                      </h3>
                      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                        {currentLesson.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">
                        ⏱ {currentLesson.duration}
                      </p>
                    </div>
                    <div className="text-6xl text-blue-600 dark:text-purple-400">{currentModule.icon}</div>
                  </div>

                  {/* Lesson Progress Dots */}
                  <div className="mt-6">
                    <div className="flex gap-1.5">
                      {currentModule.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                            completedLessons.includes(`${currentModule.id}-${lesson.id}`)
                              ? "bg-green-400"
                              : lesson.id === currentLesson.id
                              ? "bg-blue-600 dark:bg-purple-600"
                              : "bg-gray-200 dark:bg-gray-700 opacity-50"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Lesson{" "}
                      {currentModule.lessons.findIndex((l) => l.id === currentLesson.id) + 1} of{" "}
                      {currentModule.lessons.length}
                    </p>
                  </div>
                </div>

                {/* Video Container */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg mb-8">
                  <div className="relative bg-black" style={{ paddingBottom: "56.25%" }}>
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {i18n(lang, "lessonOverview")}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {currentLesson.content}
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pb-8">
                  <button
                    onClick={goToPreviousLesson}
                    disabled={
                      currentModule.lessons.findIndex((l) => l.id === currentLesson.id) === 0
                    }
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" /> {i18n(lang, "previousLesson")}
                  </button>
                  <button
                    onClick={goToNextLesson}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:opacity-90 transition shadow-lg flex items-center"
                  >
                    {currentModule.lessons.findIndex((l) => l.id === currentLesson.id) ===
                    currentModule.lessons.length - 1
                      ? `${i18n(lang, "completeModule")} →`
                      : `${i18n(lang, "nextLesson")} →`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHero = () => (
    // ... (Hero content remains the same) ...
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-y-8 transition-all duration-500 ease-out transform ${
        screen === "hero"
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-y-6 max-w-4xl p-6">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
          {i18n(lang, "learnHowOutsmart")}
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl">
          {i18n(lang, "interactiveLessons")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            onClick={() => setScreen("mode")}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-semibold rounded-full hover:shadow-xl hover:scale-[1.02] transition transform duration-300 flex items-center gap-3 shadow-lg"
          >
            {i18n(lang, "startLearning")}
            <span className="text-2xl"></span>
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-base font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-700"
            >
              {i18n(lang, "back")}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderModeSelect = () => (
    // ... (Mode Select content remains the same) ...
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-y-10 transition-all duration-500 ease-out transform ${
        screen === "mode"
          ? "translate-x-0 opacity-100"
          : screen === "hero"
          ? "translate-x-full opacity-0 pointer-events-none"
          : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="text-center max-w-3xl mb-4">
        <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
          {i18n(lang, "chooseLearningMode")}
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {i18n(lang, "pickLearningStyle")}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center w-full max-w-5xl">
        {/* Directed Learning Card */}
        <button
          onClick={openDirectedLearning}
          className="flex-1 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition transform duration-300 flex flex-col items-start text-left min-h-[250px]"
        >
          <div className="text-5xl mb-4"></div> 
          <h4 className="text-3xl font-bold mb-3">
            {i18n(lang, "directedLearning")}
          </h4>
          <p className="text-base text-purple-100 mb-6">
            {i18n(lang, "structuredPath")}
          </p>
          <span className="mt-auto inline-flex items-center gap-2 text-base font-semibold text-white/90">
            {i18n(lang, "startJourney")} <ChevronRight className="w-5 h-5" />
          </span>
        </button>

        {/* Free Learning Card */}
        <button
          onClick={() => setScreen("free")}
          className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-[1.03] transition transform duration-300 flex flex-col items-start text-left border-2 border-gray-100 dark:border-gray-700 min-h-[250px]"
        >
          <div className="text-5xl mb-4"></div>
          <h4 className="text-3xl font-bold mb-3">
            {i18n(lang, "freeLearning")}
          </h4>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
            {i18n(lang, "chooseScamType")}
          </p>
          <span className="mt-auto inline-flex items-center gap-2 text-base font-semibold text-blue-600 dark:text-purple-400">
            {i18n(lang, "startLearning")} <ChevronRight className="w-5 h-5" />
          </span>
        </button>
      </div>

      <button
        onClick={() => setScreen("hero")}
        className="mt-6 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition flex items-center"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> {i18n(lang, "back")}
      </button>
    </div>
  );
  
  // 🎯 FINAL FIX: Ensures Full-height, single-scroll container
  const renderFreeFlow = () => (
    <div
      // Use absolute inset-0 to fill the parent, and hide any overflow
      className={`absolute inset-0 flex transition-all duration-500 ease-out transform ${
        screen === "free"
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 pointer-events-none"
      } p-0 md:p-8`} 
      // Set height explicitly to manage scroll containment
      style={{ height: '100%' }}
    >
      <div 
        // Flex container for side-by-side panels. Crucially, h-full to take up ALL available height.
        className="flex w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        
        {/* --- LEFT PANEL: Category Navigation (Internal scroll if needed) --- */}
        <div className="w-full md:w-1/4 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 p-6 md:p-8 bg-gray-50 dark:bg-gray-900/50 flex flex-col">
            
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-2">
                    <Zap className="w-6 h-6"/> {i18n(lang, "exploreCategories")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{i18n(lang, "chooseScamType")}</p>
            </div>

            {/* Category Buttons - Takes up remaining vertical space, scrolls internally if categories overflow */}
            <div className="flex flex-col space-y-3 flex-grow overflow-y-auto pr-2"> 
            {categories.map((cat, index) => (
                <button
                key={cat.id}
                onClick={() => setActiveCategoryIndex(index)}
                className={`text-left flex items-center p-4 rounded-xl font-semibold transition-all duration-200 ${
                    index === activeCategoryIndex
                    ? "bg-blue-500 dark:bg-purple-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
                >
                <span className={`text-2xl mr-3 ${index === activeCategoryIndex ? 'text-white' : 'text-blue-500 dark:text-purple-400'}`}>{cat.icon}</span>
                <span className="truncate">{cat.title}</span>
                </button>
            ))}
            </div>

            {/* Back Button */}
            <button
                onClick={() => setScreen("mode")}
                className="mt-6 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center"
            >
                <ChevronLeft className="w-4 h-4 mr-1" /> {i18n(lang, "backToChoice")}
            </button>
        </div>

        {/* --- RIGHT PANEL: Content Display (MAIN scrollable area) --- */}
        <div className="w-full md:w-3/4 p-6 md:p-10 overflow-y-auto">
            
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                {categories[activeCategoryIndex].title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                {categories[activeCategoryIndex].desc}
            </p>

            {/* --- Resource Library Section --- */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-500 dark:text-purple-400" /> {i18n(lang, "resourceLibrary")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                    {libraries.length > 0 ? (
                        libraries.map((lib, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition"
                            >
                                <h5 className="font-bold text-xl text-blue-600 dark:text-purple-400 mb-1">{lib.title}</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{lib.desc}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic col-span-full">
                            {i18n(lang, "noLibraries")}
                        </p>
                    )}
                </div>
            </section>
            
            {/* --- Video Courses Section --- */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
                    <Video className="w-6 h-6 text-blue-500 dark:text-purple-400" /> {i18n(lang, "videoCourses")}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.length > 0 ? (
                        courses.map((course, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setSelectedCourse(course);
                                    setShowVideoModal(true);
                                }}
                                className="text-left bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition transform duration-200 flex flex-col group"
                            >
                                <div className="relative mb-4 overflow-hidden rounded-lg aspect-video">
                                    {/* Placeholder for video thumbnail - replace with actual image source */}
                                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <span className="text-gray-500">Thumbnail Placeholder</span>
                                    </div> 
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition">
                                        <Play className="w-10 h-10 text-white fill-white bg-blue-600/80 rounded-full p-2" />
                                    </div>
                                </div>
                                <h5 className="font-extrabold text-xl text-gray-900 dark:text-gray-100 mb-1 leading-snug">
                                    {course.title}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{course.desc}</p>
                                <div className="mt-auto flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 font-medium pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <span className="bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full">{course.level}</span>
                                    <span>⏱ {course.time}</span>
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic col-span-full">
                            {i18n(lang, "noCourses")}
                        </p>
                    )}
                </div>
            </section>
        </div>
      </div>
    </div>
  );


  // --- Main Render ---
  return (
    <div className="w-screen min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      
      {/* 🔹 Video Modal (for courses) */}
      {renderVideoModal()}

      {/* 🔹 Directed Learning Full-Screen Slide-In Overlay */}
      {renderDirectedLearningOverlay()}
      
      {/* 🔹 Main Learn Flow (Hero / Mode / Free) */}
      <section 
        // 🎯 FIXED: Removed min-h-screen to let content take over height. Added overflow-hidden to contain scrolling.
        className="min-h-screen flex items-center justify-center text-center px-0 py-0 bg-gradient-to-br from-white to-[#f5f3ff] dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 overflow-hidden"
      >
        <div 
          // 🎯 FIXED: Set height to take available viewport space (100vh - header height)
          // Assuming the header/navigation takes about 60px of vertical space, we use a calculation.
          className="relative w-full max-w-7xl h-full max-h-[100vh] overflow-hidden" 
          style={{ height: 'calc(100vh - 60px)' }} // Adjust 60px based on actual header height
        >
          
          {/* HERO SCREEN */}
          {renderHero()}

          {/* LEARNING MODE SELECTION SCREEN */}
          {renderModeSelect()}

          {/* FREE LEARNING SCREEN (Categories + Libraries + Courses) */}
          {renderFreeFlow()}

        </div>
      </section>
    </div>
  );
}