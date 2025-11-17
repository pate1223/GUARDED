import React, { useEffect, useRef, useState } from "react";
import Logo from "./assets/logo.png";
import Undraw from "./assets/undraw_surveillance_k6wl 1.png";

export default function OTPVerification({ email, onBack, onVerified }) {
  const len = 6;
  const [values, setValues] = useState(Array(len).fill(""));
  const inputsRef = useRef([]);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    inputsRef.current[0]?.focus();
    setResendDisabled(true);
    setTimer(60);
    const t = setInterval(() => {
      setTimer((s) => {
        if (s <= 1) {
          clearInterval(t);
          setResendDisabled(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (idx, ch) => {
    if (!/^\d?$/.test(ch)) return;
    const next = [...values];
    next[idx] = ch;
    setValues(next);
    if (ch && idx < len - 1) inputsRef.current[idx + 1]?.focus();
  };

  const handleKey = (e, idx) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = values.join("");
    if (code.length !== len) return alert("Enter the full code");
    // TODO: verify server-side
    console.log("verify OTP for", email, code);
    onVerified?.();
  };

  const handleResend = () => {
    setValues(Array(len).fill(""));
    inputsRef.current[0]?.focus();
    setResendDisabled(true);
    setTimer(60);
    // TODO: trigger resend API
    const t = setInterval(() => {
      setTimer((s) => {
        if (s <= 1) {
          clearInterval(t);
          setResendDisabled(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    alert("Verification code resent (mock).");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <div className="w-[1100px] h-[650px] bg-white rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left */}
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

        {/* Right: OTP */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white px-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#bcb6ff] flex items-center justify-center mb-4">
              <img src={Logo} alt="GuardEd logo" className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">OTP Verification</h2>
            <div className="text-gray-400 text-sm mb-6 text-center">
              Code is sent to <span className="font-medium">{email}</span>. Please check your inbox
            </div>
          </div>

          <div className="w-[70%] flex flex-col items-center">
            <div className="flex gap-3 justify-center mb-4">
              {values.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  value={v}
                  onChange={(e) => handleChange(i, e.target.value.trim())}
                  onKeyDown={(e) => handleKey(e, i)}
                  className="w-12 h-12 rounded-md border border-gray-200 text-center text-xl focus:outline-none"
                  maxLength={1}
                  inputMode="numeric"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              className="w-full py-3 rounded-full bg-[#5c52ff] text-white text-lg font-semibold shadow hover:bg-[#4335d1] transition mb-4"
            >
              Verify
            </button>

            <div className="text-sm text-gray-400 mb-6">
              Resend code in{" "}
              <span className="text-[#5c52ff] font-medium">
                {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
              </span>
            </div>

            <button
              disabled={resendDisabled}
              onClick={handleResend}
              className={`text-sm ${resendDisabled ? "text-gray-300" : "text-[#5c52ff] underline"}`}
              type="button"
            >
              Resend code
            </button>

            <div className="text-center text-gray-500 text-base mt-6">
              Remembered your password?{" "}
              <button className="text-[#5c52ff] font-semibold hover:underline" type="button" onClick={onBack}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}