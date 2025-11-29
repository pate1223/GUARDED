import React, { useState } from "react";
import Logo from "./assets/logo.png";
import Undraw from "./assets/undraw_surveillance_k6wl 1.png";
import ForgotPassword from "./ForgotPassword";

import {
  signInWithEmail,
  signInWithGoogle,
  signInWithFacebook
} from "./services/firebase";

import { apiService } from "./services/api";

export default function Login({ onBack, onCloseParent, setView, lang, i18n }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                       SHOW FORGOT PASSWORD SCREEN                          */
  /* -------------------------------------------------------------------------- */
  if (showForgot) {
    return (
      <ForgotPassword
        onBack={() => setShowForgot(false)}
        onCloseParent={onCloseParent}
      />
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                EMAIL LOGIN                                 */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signInWithEmail(email, password);

      if (result.success) {
        const token = await result.user.getIdToken();
        const verifyResult = await apiService.verifyUser(token);

        if (verifyResult.success) {
          localStorage.setItem("firebase_token", token);

          // Navigate based on user role
          if (verifyResult.user.role === "admin") {
            setView("admin");
          } else {
            setView("home");
          }
        } else {
          setError(i18n(lang, "userNotFoundDb"));
        }
      } else {
        setError(result.error || i18n(lang, "loginFailed"));
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(i18n(lang, "loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                              GOOGLE LOGIN                                   */
  /* -------------------------------------------------------------------------- */
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();

      if (result.success) {
        const token = await result.user.getIdToken();
        const verifyResult = await apiService.verifyUser(token);

        if (verifyResult.success) {
          localStorage.setItem("firebase_token", token);

          if (verifyResult.user.role === "admin") {
            setView("admin");
          } else {
            setView("home");
          }
        } else {
          setError(i18n(lang, "userNotFoundRegister"));
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(i18n(lang, "googleSignInFailed"));
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                             FACEBOOK LOGIN                                 */
  /* -------------------------------------------------------------------------- */
  const handleFacebookSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithFacebook();

      if (result.success) {
        const token = await result.user.getIdToken();
        const verifyResult = await apiService.verifyUser(token);

        if (verifyResult.success) {
          localStorage.setItem("firebase_token", token);

          if (verifyResult.user.role === "admin") {
            setView("admin");
          } else {
            setView("home");
          }
        } else {
          setError(i18n(lang, "userNotFoundRegister"));
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Facebook error:", err);
      setError(i18n(lang, "facebookSignInFailed"));
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <div className="w-full h-full min-h-screen flex flex-col md:flex-row overflow-hidden">

        {/* LEFT SECTION */}
        <div className="w-full md:w-1/2 bg-[#e6e3ff] flex flex-col justify-center items-center relative p-6">
          <button
            onClick={onBack}
            className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full shadow hover:bg-purple-100 transition"
            aria-label="Back"
            type="button"
          >
            <svg width="28" height="28" fill="none" stroke="#5c52ff" strokeWidth="3">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex flex-col items-center">
            <img
              src={Undraw}
              alt="Illustration"
              className="w-[320px] max-w-full mb-6"
              style={{ filter: "drop-shadow(0 12px 24px rgba(92,82,255,0.12))" }}
            />
            <div className="text-4xl font-handwritten text-[#44425a] text-center px-4">
              {i18n(lang, "everyClickMatters")}
              <br />
              {i18n(lang, "learnToClickSmart")}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#bcb6ff] flex items-center justify-center mb-4">
              <img src={Logo} alt="GuardEd logo" className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {i18n(lang, "welcomeBack")}
            </h2>
            <p className="text-gray-400 text-lg">
              {i18n(lang, "signInToContinue")}
            </p>
          </div>

          {error && (
            <div className="w-[80%] mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* FORM */}
          <form className="w-[80%] flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder={i18n(lang, "enterEmail")}
                className="w-full py-4 pl-12 pr-4 rounded-xl border bg-[#fbfbfd]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={i18n(lang, "enterPassword")}
                className="w-full py-4 pl-12 pr-12 rounded-xl border bg-[#fbfbfd]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c52ff]"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-[#5c52ff]"
                onClick={() => setShowForgot(true)}
              >
                {i18n(lang, "forgotPassword")}
              </button>
            </div>

            {/* Sign in */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#5c52ff] text-white text-xl"
            >
              {loading ? i18n(lang, "signingIn") : i18n(lang, "signIn")}
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <div className="mt-8">
            <p className="text-center text-gray-400 mb-4">
              {i18n(lang, "orContinueWith")}
            </p>

            <div className="flex gap-4 justify-center">
              {/* Google */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-12 h-12 bg-white border rounded-full shadow flex items-center justify-center"
              >
                G
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookSignIn}
                disabled={loading}
                className="w-12 h-12 bg-white border rounded-full shadow flex items-center justify-center"
              >
                f
              </button>
            </div>
          </div>

          {/* SIGN UP */}
          <div className="mt-6">
            <span className="text-gray-600">
              {i18n(lang, "dontHaveAccount")}{" "}
              <button className="text-[#5c52ff]" onClick={() => setView("signup")}>
                {i18n(lang, "signUp")}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
