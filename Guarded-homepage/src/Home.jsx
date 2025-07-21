import React from "react";
import Logo from './assets/logo.png';

export default function Home({ i18n, lang }) {
  return (
    <div className="flex flex-col items-center w-full">
      <button
        className="flex flex-col md:flex-row justify-center items-center mt-32 px-8 w-full focus:outline-none"
        type="button"
        onClick={() => alert(`${i18n(lang, "getStarted")} clicked!`)}
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