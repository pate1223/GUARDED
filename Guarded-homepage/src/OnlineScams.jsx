import React from "react";

export default function OnlineScams({ onBack }) {
  return (
    <div className="w-screen min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center px-8 py-4 bg-[#f5f3ff] shadow">
        <h1 className="text-2xl font-bold text-[#5c52ff]">Online Scams</h1>
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
          Protect Yourself from Online Scams
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Online scams are some of the most common ways fraudsters trick people
          into giving up money, personal information, or account access. Learn
          how to recognize, avoid, and protect yourself against these threats.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-12 max-w-5xl mx-auto space-y-16">
        {/* Section 1 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            1. Phishing Websites
          </h3>
          <p className="text-gray-700 mb-6">
            Fake websites often mimic real companies like banks, shopping sites,
            or government portals. They usually try to get you to log in or
            enter payment information.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Look for misspelled URLs or odd domain names.</li>
            <li>Check for HTTPS and a padlock in the browser bar.</li>
            <li>
              Never enter sensitive info on a site you arrived at through an
              email or text link.
            </li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">Example:</strong>{" "}
            A scammer creates a fake “PayPal” site like
            <em> paypa1-security.com</em> and asks you to log in.
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            2. Online Shopping Scams
          </h3>
          <p className="text-gray-700 mb-6">
            Fraudulent sellers set up fake e-commerce stores offering popular
            products at prices that are too good to be true. Victims may never
            receive their order, or receive counterfeit goods.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Be wary of deals that look “too good to be true.”</li>
            <li>
              Research the seller — look for reviews and a real business
              address.
            </li>
            <li>Use secure payment methods like credit cards, not wire transfer.</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">Example:</strong>{" "}
            An Instagram ad promotes “50% off iPhones” from an unknown website,
            but your money disappears after checkout.
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            3. Tech Support Scams
          </h3>
          <p className="text-gray-700 mb-6">
            Scammers may create fake pop-ups claiming your computer is infected
            with a virus, urging you to call a fake “support line.” They then
            try to gain access to your computer or charge fees for fake repairs.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Ignore urgent pop-ups demanding you call a number.</li>
            <li>
              Real companies like Microsoft or Apple do not send unsolicited
              warnings.
            </li>
            <li>Do not give strangers remote access to your computer.</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">Example:</strong>{" "}
            A browser pop-up says “Your computer is infected! Call Microsoft
            support now: 1-800-XXX-XXXX.”
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            4. Social Media Scams
          </h3>
          <p className="text-gray-700 mb-6">
            Scammers use social platforms to spread fake giveaways, investment
            schemes, or impersonate friends/family asking for money.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Verify requests for money — even if they come from a friend’s account.</li>
            <li>Be cautious of links shared in DMs or group chats.</li>
            <li>Report and block fake accounts immediately.</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">Example:</strong>{" "}
            You get a message from a “friend” asking for emergency money, but
            their account was hacked.
          </div>
        </section>
      </div>

      {/* Call to action */}
      <div className="px-6 py-12 bg-white border-t border-gray-200 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Stay Safe Online
        </h3>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          The best defense against scams is awareness. Keep learning and share
          this knowledge with your friends and family.
        </p>
        <button className="px-6 py-3 bg-[#5c52ff] text-white rounded-full hover:bg-[#4335d1] transition">
          Take a Quick Quiz
        </button>
      </div>
    </div>
  );
}
