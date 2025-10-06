import React, { useState } from "react";
import Logo from "./assets/logo.png";
import Diagram from "./assets/Frame 1000005999 (1).png";

export default function ResetPassword({ email, onBack, onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[!@#\$%\^&\*\(\)_\+\-=\[\]\{\};:'"\\|,.<>\/\?]/.test(password))
      return "Password must contain at least one special character.";
    if (password !== confirm) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);
    // TODO: call reset password API
    console.log("reset password for", email, password);
    alert("Password reset successful (mock). You can now sign in.");
    onDone?.();
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
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
            <img src={Diagram} alt="diagram" className="w-[300px] h-auto mb-6 object-contain" />
            <div className="text-4xl font-handwritten text-[#44425a] text-center mb-8">
              Every click matters.<br/>Learn to click smart.
            </div>
          </div>
        </div>

        {/* Right: Reset Form */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white px-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#bcb6ff] flex items-center justify-center mb-4">
              <img src={Logo} alt="GuardEd logo" className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Reset Password</h2>
            <div className="text-gray-400 text-sm mb-6 text-center">
              Reset password for <span className="font-medium">{email}</span>
            </div>
          </div>

          <form className="w-[80%] flex flex-col gap-4" onSubmit={handleSubmit}>
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

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full py-4 pl-12 pr-12 rounded-xl border border-[#f1efff] bg-[#fbfbfd] text-lg focus:outline-none focus:border-[#5c52ff] transition"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">🔒</span>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c52ff] focus:outline-none"
                onClick={() => setShowConfirm((s) => !s)}
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>

            <button type="submit" className="w-full py-4 rounded-full bg-[#5c52ff] text-white text-xl font-bold shadow hover:bg-[#4335d1] transition">
              Submit
            </button>
          </form>

          <div className="text-center text-gray-500 text-base mt-6">
            Remembered your password?{" "}
            <button className="text-[#5c52ff] font-semibold hover:underline" type="button" onClick={onDone}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}