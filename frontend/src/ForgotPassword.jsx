import React, { useState } from "react";
import Logo from "./assets/logo.png";
import Undraw from "./assets/undraw_surveillance_k6wl 1.png";
import { useLanguage } from "./contexts/LanguageContext";

// Firebase (production safe)
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./services/firebase";

export default function ForgotPassword({ onBack, onCloseParent }) {
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                             HANDLE RESET SUBMIT                             */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMsg(t("invalidEmail"));
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setEmailSent(true);
    } catch (error) {
      console.error("Reset Password Error:", error);

      switch (error.code) {
        case "auth/user-not-found":
          setErrorMsg(t("userNotFound"));
          break;
        case "auth/invalid-email":
          setErrorMsg(t("invalidEmail"));
          break;
        default:
          setErrorMsg(t("passwordResetFailed"));
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RETURN                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors">
      <div className="w-[1100px] h-[650px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl dark:shadow-purple-500/30 flex overflow-hidden">

        {/* LEFT SIDE */}
        <div className="w-1/2 bg-[#e6e3ff] dark:bg-gray-700 flex flex-col justify-center items-center relative">

          {/* Back Button */}
          <button
            onClick={onBack}
            type="button"
            aria-label="Back"
            className="absolute top-10 left-10 w-12 h-12 rounded-full bg-white dark:bg-gray-600 shadow flex items-center justify-center hover:bg-purple-100 dark:hover:bg-gray-500 transition"
          >
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="text-purple-600 dark:text-purple-400">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Illustration */}
          <div className="flex flex-col items-center mt-8">
            <img
              src={Undraw}
              alt="Illustration"
              className="w-[320px] h-auto object-contain mb-6"
              style={{ filter: "drop-shadow(0 12px 24px rgba(92,82,255,0.12))" }}
            />
            <div className="text-4xl font-handwritten text-[#44425a] dark:text-gray-200 text-center">
              {t("everyClickMatters")}
              <br />
              {t("learnToClickSmart")}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white dark:bg-gray-800 px-10 transition-colors">

          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#bcb6ff] dark:border-purple-600 flex items-center justify-center mb-4">
              <img src={Logo} alt="GuardEd logo" className="w-12 h-12" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
              {t("forgotPassword")}
            </h2>

            <div className="text-gray-400 dark:text-gray-500 text-lg text-center">
              {t("enterEmailForReset")}
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          {emailSent && (
            <div className="w-[80%] p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg text-center mb-4">
              {t("passwordResetEmailSent")}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <div className="w-[80%] p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-center mb-4">
              {errorMsg}
            </div>
          )}

          {/* FORM */}
          <form className="w-[80%] flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="email"
                placeholder={t("enterEmailId")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full py-4 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-lg text-gray-800 dark:text-gray-100 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition"
              />

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M4 4h16v16H4V4zm0 0l8 8 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#5c52ff] dark:bg-purple-500 text-white text-xl font-bold shadow hover:bg-[#4335d1] dark:hover:bg-purple-600 transition disabled:opacity-50"
            >
              {loading ? t("sending") : t("submit")}
            </button>
          </form>

          {/* Link back to Sign In */}
          <div className="mt-6 text-gray-500 dark:text-gray-400">
            {t("rememberedPassword")}{" "}
            <button type="button" className="text-[#5c52ff] dark:text-purple-400 font-semibold hover:underline" onClick={onCloseParent}>
              {t("signIn")}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
