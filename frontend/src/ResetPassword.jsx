import React, { useState } from "react";
import Logo from "./assets/logo.png";
import Diagram from "./assets/Frame 1000005999 (1).png";
import { useLanguage } from "./contexts/LanguageContext";
import { auth } from "./services/firebase";

export default function ResetPassword({ email, onBack, onDone }) {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                VALIDATION                                  */
  /* -------------------------------------------------------------------------- */
  const validate = () => {
    if (password.length < 8) return t("passwordMustBe8Chars");
    if (!/[!@#\$%\^&\*\(\)_\+\-=\[\]\{\};:'"\\|,.<>\/\?]/.test(password))
      return t("passwordMustHaveSpecial");
    if (password !== confirm) return t("passwordsDoNotMatch");
    return null;
  };

  /* -------------------------------------------------------------------------- */
  /*                         HANDLE RESET SUBMISSION                             */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return alert(err);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const oobCode = urlParams.get("oobCode");

      if (oobCode) {
        // 🔥 User clicked password reset EMAIL link → finalize reset
        const { confirmPasswordReset } = await import("firebase/auth");

        await confirmPasswordReset(auth, oobCode, password);

        alert(t("passwordResetSuccess"));
        onDone?.();
      } else {
        // 🔥 No oobCode → they came from ForgotPassword screen → send email again
        const { sendPasswordResetEmail } = await import("firebase/auth");

        await sendPasswordResetEmail(auth, email);
        alert(t("passwordResetEmailSent"));
        onDone?.();
      }
    } catch (error) {
      console.error("Password reset error:", error);

      if (error.code === "auth/invalid-action-code") {
        alert(t("resetLinkExpired"));
      } else if (error.code === "auth/weak-password") {
        alert(t("passwordTooWeak"));
      } else {
        alert(t("passwordResetFailed"));
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                       */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-[1100px] h-[650px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex overflow-hidden">

        {/* LEFT SIDE */}
        <div className="w-1/2 bg-[#e6e3ff] dark:bg-gray-700 flex flex-col justify-center items-center relative">
          <button
            onClick={onBack}
            type="button"
            aria-label="Back"
            className="absolute top-10 left-10 w-12 h-12 bg-white dark:bg-gray-600 rounded-full shadow flex items-center justify-center hover:bg-purple-100 dark:hover:bg-gray-500 transition"
          >
            <svg width="28" height="28" fill="none" stroke="#5c52ff" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex flex-col items-center mt-8">
            <img
              src={Diagram}
              alt="Reset illustration"
              className="w-[300px] h-auto mb-6 object-contain"
            />
            <div className="text-4xl font-handwritten text-[#44425a] dark:text-gray-200 text-center">
              {t("everyClickMatters")}
              <br />
              {t("learnToClickSmart")}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white dark:bg-gray-800 px-8">
          {/* Logo + Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#bcb6ff] dark:border-purple-600 flex items-center justify-center mb-4">
              <img src={Logo} alt="GuardEd logo" className="w-12 h-12" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
              {t("resetPassword")}
            </h2>

            <div className="text-gray-400 dark:text-gray-500 text-sm text-center mt-1">
              {t("resetPasswordFor")} <span className="font-medium">{email}</span>
            </div>
          </div>

          {/* FORM */}
          <form className="w-[80%] flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {/* New Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("enterPassword")}
                className="w-full py-4 pl-12 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-[#fbfbfd] dark:bg-gray-700 text-lg focus:outline-none focus:border-[#5c52ff] dark:focus:border-purple-400 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">🔒</span>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c52ff]"
                onClick={() => setShowPassword((x) => !x)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder={t("confirmPassword")}
                className="w-full py-4 pl-12 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-[#fbfbfd] dark:bg-gray-700 text-lg focus:outline-none focus:border-[#5c52ff] dark:focus:border-purple-400 transition"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c52ff]">🔒</span>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c52ff]"
                onClick={() => setShowConfirm((x) => !x)}
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#5c52ff] dark:bg-purple-500 text-white text-xl font-bold shadow hover:bg-[#4335d1] dark:hover:bg-purple-600 transition"
            >
              {t("submit")}
            </button>
          </form>

          {/* Bottom Navigation */}
          <div className="text-center text-gray-500 dark:text-gray-400 text-base mt-6">
            {t("rememberedPassword")}{" "}
            <button
              className="text-[#5c52ff] dark:text-purple-400 font-semibold hover:underline"
              type="button"
              onClick={onDone}
            >
              {t("signIn")}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
