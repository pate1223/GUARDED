import React from "react";

export default function CallScams({ onBack }) {
  return (
    <div className="w-screen min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center px-8 py-4 bg-[#f5f3ff] shadow">
        <h1 className="text-2xl font-bold text-[#5c52ff]">Call Scams</h1>
        <button
          onClick={onBack}
          className="px-6 py-2 border border-[#5c52ff] rounded-full text-[#5c52ff] hover:bg-[#e6e3ff] font-semibold"
        >
          Back
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 py-12 bg-gradient-to-r from-[#f5f3ff] to-white text-center">
        <h2 className="text-4xl font-bold text-[#5c52ff] mb-4">
          Protect Yourself from Call Scams
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Call scams are a common method for fraudsters to trick people into giving up money, personal information, or account access. Learn how to recognize suspicious calls and protect yourself.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-12 max-w-5xl mx-auto space-y-16">
        {/* Section 1 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            1. Impersonation Scams
          </h3>
          <p className="text-gray-700 mb-6">
            Scammers may pretend to be government officials, banks, or tech support representatives to get sensitive information.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Never give personal info over the phone unless you initiated the call.</li>
            <li>Verify the caller's identity through official channels.</li>
            <li>Hang up if the caller pressures you for money or personal info.</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">Example:</strong>{" "}
            A caller claims to be from the CRA demanding immediate payment for taxes.
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            2. Tech Support Scams
          </h3>
          <p className="text-gray-700 mb-6">
            Scammers pretend your computer is infected and try to get you to pay for fake repairs or give remote access.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Ignore unsolicited tech support calls.</li>
            <li>Never grant remote access unless verified.</li>
            <li>Do not pay for unnecessary services.</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">Example:</strong>{" "}
            A pop-up instructs you to call "Microsoft support" at a number you didn’t look up yourself.
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            3. Prize and Lottery Scams
          </h3>
          <p className="text-gray-700 mb-6">
            Scammers claim you won a prize or lottery but must pay fees or taxes upfront.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Be skeptical of unexpected calls claiming you won something.</li>
            <li>Legitimate prizes don’t require advance payment.</li>
            <li>Do not share banking info or personal documents.</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">Example:</strong>{" "}
            You get a call saying you won a $5,000 lottery and must wire a fee to claim it.
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            4. Threatening Scams
          </h3>
          <p className="text-gray-700 mb-6">
            Scammers use fear tactics, claiming legal trouble or arrest if you don’t pay immediately.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Stay calm and do not respond to threats.</li>
            <li>Verify claims through official sources.</li>
            <li>Report threatening calls to authorities.</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">Example:</strong>{" "}
            A caller claims you will be arrested for unpaid fines unless you send money immediately.
          </div>
        </section>
      </div>

      {/* Call to action */}
      <div className="px-6 py-12 bg-white border-t border-gray-200 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Stay Safe from Call Scams
        </h3>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Awareness is the best defense. Learn the signs, stay cautious, and educate friends and family.
        </p>
        <button className="px-6 py-3 bg-[#5c52ff] text-white rounded-full hover:bg-[#4335d1] transition">
          Take a Quick Quiz
        </button>
      </div>
    </div>
  );
}
