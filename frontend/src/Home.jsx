import React, { useState } from "react";
import Logo from './assets/logo.png';

export default function Home({ i18n, lang }) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <h2 className="text-2xl font-bold text-gray-900">{i18n(lang, "welcomeToGuardED")}</h2>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
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
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="GuardED Introduction Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50">
              <p className="text-gray-600 text-center mb-4">
                {i18n(lang, "learnProtect")}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold shadow-lg"
                >
                  {i18n(lang, "startLearning")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        className="flex flex-col md:flex-row justify-center items-center mt-32 px-8 w-full focus:outline-none"
        type="button"
        onClick={() => setShowVideoModal(true)}
      >
        <div className="relative flex items-center justify-center">
          {/* Purple blob background */}
          <div className="absolute w-[500px] h-[420px] bg-[#e6e3ff] rounded-[40%] blur-xl opacity-90 z-0" />
          {/* Logo image */}
          <img
            src={Logo}
            alt="GuardEd logo"
            className="relative w-[420px] h-auto drop-shadow-2xl rounded-3xl border-4 border-[#5c52ff] bg-gradient-to-br from-[#6a5cff] via-white to-[#5c52ff] p-2 z-10"
            style={{
              boxShadow: "0 0 60px 10px #5c52ff55, 0 8px 32px #5c52ff22"
            }}
          />
          {/* Shiny overlay */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-3xl z-20"
            style={{
              background: "linear-gradient(120deg, #fff6 40%, #5c52ff22 100%)",
              mixBlendMode: "screen"
            }}
          />
        </div>
        <div className="text-center md:text-left md:ml-20">
          <span className="block text-8xl font-extrabold text-[#5c52ff] mb-4 drop-shadow-lg">
            GuardED
          </span>
          <span className="block text-3xl font-semibold text-[#5c52ff] mb-3 drop-shadow">
            {i18n(lang, "staySafe")}
          </span>
          <span className="block text-3xl font-semibold text-[#5c52ff] mb-3 drop-shadow">
            {i18n(lang, "defend")}
          </span>
          <span className="block text-3xl font-semibold text-[#5c52ff] mb-8 drop-shadow">
            {i18n(lang, "against")}
          </span>
          <span className="mt-10 inline-block">
            <span className="px-14 py-6 bg-gradient-to-br from-[#6a5cff] to-[#5c52ff] text-white font-semibold rounded-full hover:bg-[#4335d1] text-2xl shadow-lg transition-all duration-200">
              {i18n(lang, "getStarted")}
            </span>
          </span>
        </div>
      </button>
      {/* Add more homepage sections/components here if needed */}
    </div>
  );
}