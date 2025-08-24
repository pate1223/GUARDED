import React from "react";
import Logo from "./assets/logo.png";
import './index.css';

export default function SignIn({ onBack }) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <div className="w-[1100px] h-[650px] bg-white rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 bg-[#e6e3ff] flex flex-col justify-center items-center relative">
          {/* Back button */}
          <button
            onClick={onBack}
            className="absolute top-10 left-10 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-purple-100 transition"
            aria-label="Back"
          >
            <svg width="28" height="28" fill="none" stroke="#5c52ff" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* Illustration */}
          <div className="flex flex-col items-center mt-16">
            <div className="mb-8">
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                <circle cx="90" cy="90" r="80" fill="#fff" stroke="#bcb6ff" strokeDasharray="6 6" strokeWidth="2"/>
                <circle cx="90" cy="90" r="60" fill="#44425a"/>
                <circle cx="90" cy="90" r="35" fill="#fff"/>
                <ellipse cx="90" cy="110" rx="7" ry="12" fill="#44425a"/>
                <circle cx="130" cy="60" r="8" fill="#5c52ff"/>
                <circle cx="50" cy="120" r="8" fill="#5c52ff"/>
                <circle cx="130" cy="120" r="6" fill="#5c52ff"/>
                <circle cx="50" cy="60" r="6" fill="#5c52ff"/>
              </svg>
            </div>
            <div className="text-4xl font-handwritten text-[#44425a] text-center mb-8">
              Every click matters.<br/>Learn to click smart.
            </div>
            <div className="absolute bottom-10 left-10">
              <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
                <rect x="20" y="60" width="20" height="40" rx="5" fill="#22223b"/>
                <ellipse cx="30" cy="80" rx="10" ry="15" fill="#5c52ff"/>
                <rect x="25" y="70" width="10" height="20" rx="2" fill="#fff"/>
                <circle cx="30" cy="65" r="7" fill="#5c52ff"/>
              </svg>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white">
          <img src={Logo} alt="GuardEd logo" className="w-24 h-24 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Welcome to <span className="text-[#5c52ff]">GuardEd!</span></h2>
          <div className="w-[80%] flex flex-col gap-6">
            <button className="w-full py-5 rounded-full border border-[#e6e3ff] text-[#5c52ff] text-xl font-semibold bg-white hover:bg-[#e6e3ff] transition">
              Login
            </button>
            <button className="w-full py-5 rounded-full border border-[#e6e3ff] text-[#5c52ff] text-xl font-semibold bg-white hover:bg-[#e6e3ff] transition">
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}