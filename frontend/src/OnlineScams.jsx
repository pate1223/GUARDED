import React from "react";

export default function OnlineScams({ onBack, lang, i18n }) {
  return (
    <div className="w-screen min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center px-8 py-4 bg-[#f5f3ff] shadow">
        <h1 className="text-2xl font-bold text-[#5c52ff]">{i18n(lang, 'onlineScamsTitle')}</h1>
        <button
          onClick={onBack}
          className="px-6 py-2 border border-[#5c52ff] rounded-full text-[#5c52ff] hover:bg-[#e6e3ff] font-semibold"
        >
          {i18n(lang, 'back')}
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 py-12 bg-gradient-to-r from-[#f5f3ff] to-white text-center">
        <h2 className="text-4xl font-bold text-[#5c52ff] mb-4">
          {i18n(lang, 'protectYourselfOnline')}
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          {i18n(lang, 'onlineScamsIntro')}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-12 max-w-5xl mx-auto space-y-16">
        {/* Section 1 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            1. {i18n(lang, 'phishingWebsites')}
          </h3>
          <p className="text-gray-700 mb-6">
            {i18n(lang, 'phishingDesc')}
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>{i18n(lang, 'phishingTip1')}</li>
            <li>{i18n(lang, 'phishingTip2')}</li>
            <li>{i18n(lang, 'phishingTip3')}</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">{i18n(lang, 'example')}</strong>{" "}
            {i18n(lang, 'phishingExample')}
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            2. {i18n(lang, 'onlineShoppingScams')}
          </h3>
          <p className="text-gray-700 mb-6">
            {i18n(lang, 'shoppingScamsDesc')}
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>{i18n(lang, 'shoppingTip1')}</li>
            <li>{i18n(lang, 'shoppingTip2')}</li>
            <li>{i18n(lang, 'shoppingTip3')}</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">{i18n(lang, 'example')}</strong>{" "}
            {i18n(lang, 'shoppingExample')}
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            3. {i18n(lang, 'techSupportScams')}
          </h3>
          <p className="text-gray-700 mb-6">
            {i18n(lang, 'techSupportDesc')}
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>{i18n(lang, 'techTip1')}</li>
            <li>{i18n(lang, 'techTip2')}</li>
            <li>{i18n(lang, 'techTip3')}</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">{i18n(lang, 'example')}</strong>{" "}
            {i18n(lang, 'techExample')}
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            4. {i18n(lang, 'socialMediaScams')}
          </h3>
          <p className="text-gray-700 mb-6">
            {i18n(lang, 'socialMediaScamsDesc')}
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>{i18n(lang, 'socialTip1')}</li>
            <li>{i18n(lang, 'socialTip2')}</li>
            <li>{i18n(lang, 'socialTip3')}</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">{i18n(lang, 'example')}</strong>{" "}
            {i18n(lang, 'socialExample')}
          </div>
        </section>
      </div>

      {/* Call to action */}
      <div className="px-6 py-12 bg-white border-t border-gray-200 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {i18n(lang, 'staySafeOnline')}
        </h3>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          {i18n(lang, 'bestDefense')}
        </p>
        <button className="px-6 py-3 bg-[#5c52ff] text-white rounded-full hover:bg-[#4335d1] transition">
          {i18n(lang, 'takeQuickQuiz')}
        </button>
      </div>
    </div>
  );
}