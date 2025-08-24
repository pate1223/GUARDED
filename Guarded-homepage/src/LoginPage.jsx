import React from "react";

function LoginPage() {
  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* Left side */}
      <div className="w-1/2 h-full bg-purple-200 flex flex-col justify-center items-center p-12">
        <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center leading-snug">
          Every click matters.
          <br />
          Learn to click smart.
        </h2>

      </div>

      {/* Right side */}
      <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center p-12">
        <div className="flex flex-col items-center max-w-sm w-full">
          {/* Circle icon at top */}
          <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-purple-100">
            
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-10 text-gray-800 text-center">
            Welcome to GuardEd!
          </h1>

          {/* Buttons */}
          <button className="w-full py-3 mb-4 rounded-full border border-purple-200 text-purple-600 font-medium hover:bg-purple-50 transition">
            Login
          </button>
          <button className="w-full py-3 rounded-full border border-purple-200 text-purple-600 font-medium hover:bg-purple-50 transition">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
