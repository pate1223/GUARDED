import React, { useState } from "react";
import Logo from "./assets/logo.png";
import Undraw from "./assets/undraw_surveillance_k6wl 1.png";
import { signUpWithEmail, signInWithGoogle, signInWithFacebook } from "./services/firebase";
import { apiService } from "./services/api";

export default function CreateAccount({ onBack, setView, lang, i18n }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //-------------------------------------
  // EMAIL SIGN-UP
  //-------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(i18n(lang, "enterFullName"));
      return;
    }
    if (!agree) {
      setError(i18n(lang, "agreeToTermsError"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await signUpWithEmail(email, password, name.trim());

      if (!result.success) {
        setError(result.error);
        return;
      }

      const token = await result.user.getIdToken();

      const registerData = {
        firebase_uid: result.user.uid,
        user_id: name.trim(),
        email,
        role: "user",
      };

      const registerResult = await apiService.registerUser(registerData);

      if (!registerResult.success) {
        setError(registerResult.error || i18n(lang, "registrationFailed"));
        return;
      }

      localStorage.setItem("firebase_token", token);

      // ⬅ Correct navigation for your AppContent system
      setView("home");

    } catch (err) {
      setError(i18n(lang, "registrationFailed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //-------------------------------------
  // GOOGLE SIGN-IN
  //-------------------------------------
  const handleGoogle = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setError(result.error);
        return;
      }

      const token = await result.user.getIdToken();

      // check if already exists
      const verify = await apiService.verifyUser(token);

      if (!verify.success) {
        // register new google user
        const registerData = {
          firebase_uid: result.user.uid,
          user_id: result.user.displayName || result.user.email.split("@")[0],
          email: result.user.email,
          role: "user",
        };

        const reg = await apiService.registerUser(registerData);
        if (!reg.success) {
          setError(reg.error);
          return;
        }
      }

      localStorage.setItem("firebase_token", token);
      setView("home");

    } catch (err) {
      setError(i18n(lang, "googleSignInFailed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //-------------------------------------
  // FACEBOOK SIGN-IN
  //-------------------------------------
  const handleFacebook = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithFacebook();
      if (!result.success) {
        setError(result.error);
        return;
      }

      const token = await result.user.getIdToken();
      const verify = await apiService.verifyUser(token);

      if (!verify.success) {
        const registerData = {
          firebase_uid: result.user.uid,
          user_id: result.user.displayName || result.user.email.split("@")[0],
          email: result.user.email,
          role: "user",
        };

        const reg = await apiService.registerUser(registerData);
        if (!reg.success) {
          setError(reg.error);
          return;
        }
      }

      localStorage.setItem("firebase_token", token);
      setView("home");

    } catch (err) {
      setError(i18n(lang, "facebookSignInFailed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //-------------------------------------
  // JSX
  //-------------------------------------
  return (
    <div className="w-full min-h-screen flex bg-white">
      <div className="w-full h-full min-h-screen flex flex-col md:flex-row overflow-hidden">

        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 bg-[#e6e3ff] flex flex-col justify-center items-center relative p-6">

          <button
            type="button"
            onClick={onBack}
            className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-purple-100 transition"
          >
            <svg width="28" height="28" fill="none" stroke="#5c52ff" strokeWidth="3">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <img
            src={Undraw}
            alt=""
            className="w-[320px] mb-6 drop-shadow-xl"
          />

          <div className="text-4xl font-handwritten text-[#44425a] text-center px-4">
            {i18n(lang, "everyClickMatters")}<br />
            {i18n(lang, "learnClickSmart")}
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 bg-white overflow-y-auto">

          <div className="w-20 h-20 rounded-full border-4 border-[#bcb6ff] flex items-center justify-center mb-6">
            <img src={Logo} alt="GuardEd" className="w-12 h-12" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-1 text-center">
            {i18n(lang, "welcomeToGuardEd")} <span className="text-[#5c52ff]">GuardEd!</span>
          </h2>

          <div className="text-gray-400 text-lg mb-6 text-center">
            {i18n(lang, "signUpToContinue")}
          </div>

          {error && (
            <div className="w-[80%] mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* FORM */}
          <form className="w-[80%] flex flex-col gap-4" onSubmit={handleSubmit}>

            {/* Name */}
            <div className="relative">
              <input
                type="text"
                placeholder={i18n(lang, "enterFullName")}
                className="w-full py-4 pl-12 pr-4 rounded-xl border border-[#f1efff] bg-[#fbfbfd] text-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">👤</span>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder={i18n(lang, "enterEmail")}
                className="w-full py-4 pl-12 pr-4 rounded-xl border border-[#f1efff] bg-[#fbfbfd] text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">✉️</span>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={i18n(lang, "enterPassword")}
                className="w-full py-4 pl-12 pr-12 rounded-xl border border-[#f1efff] bg-[#fbfbfd] text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">🔒</span>

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Agree to terms */}
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                {i18n(lang, "iAgreeToTerms")}{" "}
                <button type="button" className="text-[#5c52ff] underline">
                  {i18n(lang, "termsAndConditions")}
                </button>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#5c52ff] text-white text-xl font-bold shadow hover:bg-[#4335d1] disabled:opacity-50"
            >
              {loading ? i18n(lang, "creatingAccount") : i18n(lang, "signUp")}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center w-full my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="mx-4 text-gray-400">{i18n(lang, "orContinueWith")}</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google + Facebook */}
          <div className="flex gap-4">

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow hover:bg-gray-100 disabled:opacity-50"
            >
              <svg viewBox="0 0 533.5 544.3" className="w-6 h-6">
                <path fill="#4285F4" d="M533.5 278.4..."></path>
                <path fill="#34A853" d="M272 544.3..."></path>
                <path fill="#FBBC05" d="M121.5 326.5..."></path>
                <path fill="#EA4335" d="M272 107.7..."></path>
              </svg>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebook}
              disabled={loading}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow hover:bg-gray-100 disabled:opacity-50"
            >
              <svg viewBox="0 0 320 512" className="w-5 h-5" fill="#1877F2">
                <path d="M279.14 288..."></path>
              </svg>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
