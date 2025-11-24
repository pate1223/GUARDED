import React, { useState } from "react";
import Logo from "./assets/logo.png";
import './index.css';
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import Undraw from "./assets/undraw_surveillance_k6wl 1.png";

export default function SignIn({ onBack, lang, i18n }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // when showLogin is true, render the full Login page
  if (showLogin) {
    return <Login onBack={() => setShowLogin(false)} onCloseParent={onBack} lang={lang} i18n={i18n} />;
  }

  if (showCreate) {
    return (
      <CreateAccount
        onBack={() => setShowCreate(false)}
        onGoToLogin={() => { setShowCreate(false); setShowLogin(true); }}
        onCloseParent={onBack}
        lang={lang}
        i18n={i18n}
      />
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="w-full h-full flex overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 bg-[#e6e3ff] flex flex-col justify-center items-center relative">
          {/* Back button */}
          <button
            onClick={onBack}
            className="absolute top-10 left-10 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-purple-100 transition"
            aria-label="Back"
            type="button"
          >
            <svg width="28" height="28" fill="none" stroke="#5c52ff" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Illustration (using Undraw PNG) */}
          <div className="flex flex-col items-center mt-16">
            <div className="mb-8">
              <img
                src={Undraw}
                alt="Illustration"
                className="w-[320px] h-auto object-contain"
                style={{ filter: 'drop-shadow(0 12px 24px rgba(92,82,255,0.12))' }}
              />
            </div>

            <div className="text-4xl font-handwritten text-[#44425a] text-center mb-8">
              {i18n(lang, 'everyClickMatters')}<br/>{i18n(lang, 'learnClickSmart')}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white">
          <img src={Logo} alt="GuardEd logo" className="w-24 h-24 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-8">{i18n(lang, 'welcomeToGuardEd')} <span className="text-[#5c52ff]">GuardEd!</span></h2>
          <div className="w-[80%] flex flex-col gap-6">
            <button
              className="w-full py-5 rounded-full border border-[#e6e3ff] text-[#5c52ff] text-xl font-semibold bg-white hover:bg-[#e6e3ff] transition"
              onClick={() => setShowLogin(true)}
            >
              {i18n(lang, 'login')}
            </button>
            <button
              className="w-full py-5 rounded-full border border-[#e6e3ff] text-[#5c52ff] text-xl font-semibold bg-white hover:bg-[#e6e3ff] transition"
              onClick={() => setShowCreate(true)}
            >
              {i18n(lang, 'createAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}