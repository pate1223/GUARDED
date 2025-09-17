import React, { useState } from "react";
import Logo from "./assets/logo.png";
import Undraw from "./assets/undraw_surveillance_k6wl 1.png";
import ForgotPassword from "./ForgotPassword"; // <-- added import
import GoogleIcon from "./assets/google-color.png";

export default function Login({ onBack, onCloseParent }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false); // <-- added state

  // show ForgotPassword screen when requested
  if (showForgot) {
    return <ForgotPassword onBack={() => setShowForgot(false)} onCloseParent={onCloseParent} />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with real auth
    console.log("login", { email, password });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <div className="w-[1100px] h-[650px] bg-white rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left Illustration */}
        <div className="w-1/2 bg-[#e6e3ff] flex flex-col justify-center items-center relative">
          {/* Back button to SignIn screen */}
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
            {/* replaced inline SVG with provided PNG asset */}
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

        {/* Right: Login Form */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white px-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#bcb6ff] flex items-center justify-center mb-4">
              <img src={Logo} alt="GuardEd logo" className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome Back!</h2>
            <div className="text-gray-400 text-lg mb-6 text-center">Sign in to continue</div>
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

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full py-4 pl-12 pr-12 rounded-xl border border-[#f1efff] bg-[#fbfbfd] text-lg focus:outline-none focus:border-[#5c52ff] transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" stroke="#5c52ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c52ff] focus:outline-none"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 1l22 22M17.94 17.94A10.94 10.94 0 0 1 12 19.5c-5 0-9.27-3.11-11-7.5a10.97 10.97 0 0 1 5.17-5.92M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-5.97" stroke="#5c52ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" stroke="#5c52ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => setShowForgot(true)} className="text-[#5c52ff] font-semibold hover:underline text-base">Forgot password?</button>
            </div>

            <button type="submit" className="w-full py-4 rounded-full bg-[#5c52ff] text-white text-xl font-bold shadow hover:bg-[#4335d1] transition">
              Sign in
            </button>
          </form>

          <div className="flex items-center w-full my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="mx-4 text-gray-400">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="flex gap-4 mb-4">
            <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow hover:bg-gray-100 transition" type="button" aria-label="Continue with Facebook">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-6 h-6" />
            </button>

            <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow hover:bg-gray-100 transition" type="button" aria-label="Continue with Google">
              <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center text-gray-500 text-base">
            Don’t have an account?{" "}
            <button className="text-[#5c52ff] font-semibold hover:underline" type="button" onClick={onCloseParent}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}