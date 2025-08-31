import React, { useState } from "react";
import Logo from "./assets/logo.png";
import Undraw from "./assets/undraw_surveillance_k6wl 1.png";

export default function CreateAccount({ onBack, onGoToLogin, onCloseParent }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) return alert("Please agree to terms and conditions.");
    console.log("create-account", { name, email, phone, password });
    // TODO: real signup flow
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <div className="w-[1100px] h-[650px] bg-white rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left Illustration */}
        <div className="w-1/2 bg-[#e6e3ff] flex flex-col justify-center items-center relative">
          <button
            type="button"
            onClick={onBack}
            className="absolute top-10 left-10 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-purple-100 transition"
            aria-label="Back"
          >
            <svg width="28" height="28" fill="none" stroke="#5c52ff" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex flex-col items-center mt-8">
            {/* use same PNG asset as Login */}
            <img
              src={Undraw}
              alt="Illustration"
              className="w-[320px] h-auto object-contain mb-6"
              style={{ filter: 'drop-shadow(0 12px 24px rgba(92,82,255,0.12))' }}
            />

            <div className="text-4xl font-handwritten text-[#44425a] text-center mb-8">
              Every click matters.<br/>Learn to click smart.
            </div>
          </div>
        </div>

        {/* Right: Create Account Form */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white px-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#bcb6ff] flex items-center justify-center mb-4">
              <img src={Logo} alt="GuardEd logo" className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome to <span className="text-[#5c52ff]">GuardEd!</span></h2>
            <div className="text-gray-400 text-lg mb-6 text-center">Sign up to continue</div>
          </div>

          <form className="w-[80%] flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Full Name"
                className="w-full py-4 pl-12 pr-4 rounded-xl border border-[#f1efff] bg-[#fbfbfd] text-lg focus:outline-none focus:border-[#5c52ff] transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">👤</span>
            </div>

            <div className="relative">
              <input
                type="email"
                placeholder="Enter Email Id"
                className="w-full py-4 pl-12 pr-4 rounded-xl border border-[#f1efff] bg-[#fbfbfd] text-lg focus:outline-none focus:border-[#5c52ff] transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">✉️</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Enter Phone No."
                  className="w-full py-4 pl-12 pr-4 rounded-xl border border-[#f1efff] bg-[#fbfbfd] text-lg focus:outline-none focus:border-[#5c52ff] transition"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">📞</span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  className="w-full py-4 pl-12 pr-12 rounded-xl border border-[#f1efff] bg-[#fbfbfd] text-lg focus:outline-none focus:border-[#5c52ff] transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">🔒</span>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c52ff] focus:outline-none"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 text-gray-600">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>I Agree to <button type="button" className="text-[#5c52ff] underline">terms and conditions</button></span>
            </label>

            <button type="submit" className="w-full py-4 rounded-full bg-[#5c52ff] text-white text-xl font-bold shadow hover:bg-[#4335d1] transition">
              Sign up
            </button>
          </form>

          <div className="flex items-center w-full my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="mx-4 text-gray-400">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="flex gap-4 mb-4">
            <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow hover:bg-gray-100 transition">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow hover:bg-gray-100 transition">
              <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#000"/><path d="M12 7v5l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow hover:bg-gray-100 transition">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center text-gray-500 text-base">
            Already have an account?{" "}
            <button className="text-[#5c52ff] font-semibold hover:underline" type="button" onClick={onGoToLogin}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}