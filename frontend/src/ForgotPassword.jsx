import React, { useState } from "react";
import Logo from "./assets/logo.png";
import Undraw from "./assets/undraw_surveillance_k6wl 1.png";
import OTPVerification from "./OTPVerification";
import ResetPassword from "./ResetPassword";

export default function ForgotPassword({ onBack, onCloseParent }) {
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("forgot-password:", email);
    setShowOTP(true);
  };

  if (showOTP && !showReset) {
    return (
      <OTPVerification
        email={email}
        onBack={() => setShowOTP(false)}
        onVerified={() => {
          // instead of closing flow, show reset password screen
          setShowReset(true);
        }}
      />
    );
  }

  if (showReset) {
    return (
      <ResetPassword
        email={email}
        onBack={() => setShowReset(false)}
        onDone={() => onCloseParent?.()}
      />
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-[1100px] h-[650px] bg-white rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left Illustration */}
        <div className="w-1/2 bg-[#e6e3ff] flex flex-col justify-center items-center relative">
          <button
            onClick={onBack}
            className="absolute top-10 left-10 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-purple-100 transition"
            aria-label="Back"
            type="button"
          >
            <svg width="28" height="28" fill="none" stroke="#5c52ff" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex flex-col items-center mt-8">
            <img
              src={Undraw}
              alt="Illustration"
              className="w-[320px] h-auto object-contain mb-6"
              style={{ filter: "drop-shadow(0 12px 24px rgba(92,82,255,0.12))" }}
            />

            <div className="text-4xl font-handwritten text-[#44425a] text-center mb-8">
              Every click matters.
              <br />
              Learn to click smart.
            </div>
          </div>
        </div>

        {/* Right: Forgot Password Form */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white px-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#bcb6ff] flex items-center justify-center mb-4">
              <img src={Logo} alt="GuardEd logo" className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Forgot Password</h2>
            <div className="text-gray-400 text-lg mb-6 text-center">Enter your email address or mobile number to receive password reset instructions</div>
          </div>

          <form className="w-[80%] flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter Email Id"
                className="w-full py-4 pl-12 pr-4 rounded-xl border border-[#f1efff] bg-[#fbfbfd] text-lg focus:outline-none focus:border-[#5c52ff] transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4V4zm0 0l8 8 8-8" stroke="#5c52ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>

            <button type="submit" className="w-full py-4 rounded-full bg-[#5c52ff] text-white text-xl font-bold shadow hover:bg-[#4335d1] transition">
              Submit
            </button>
          </form>

          <div className="text-center text-gray-500 text-base mt-6">
            Remembered your password?{" "}
            <button className="text-[#5c52ff] font-semibold hover:underline" type="button" onClick={onCloseParent}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}