import React from "react";

export default function CallScams({ onBack }) {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-[#5c52ff] mb-4">Call Scams</h1>
      <p className="text-gray-700 mb-6">Hello from Call Scams page!</p>
      <button
        onClick={onBack}
        className="px-6 py-2 border border-[#5c52ff] rounded-full text-[#5c52ff] hover:bg-[#e6e3ff] font-semibold"
      >
        Back
      </button>
    </div>
  );
}