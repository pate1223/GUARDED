import React from "react";

export default function WhyItMatters({ lang, i18n }) {
  // Fallbacks in case i18n or keys are missing
  const t = (key, fallback) => {
    try {
      if (i18n) {
        const value = i18n(lang, key);
        if (value && typeof value === "string") return value;
      }
    } catch {}
    return fallback;
  };

  return (
    <div className="w-full flex flex-col items-center bg-white pt-32 pb-32">
      <div className="max-w-4xl w-full px-8">

        {/* SECTION TITLE 1 */}
        <h2
          className="text-3xl md:text-4xl font-extrabold text-center mb-2"
          style={{ fontFamily: "Outfit, Arial, sans-serif" }}
        >
          <span className="inline-block border-b-8 border-[#5c52ff] pb-1 px-4">
            {t("whyItMatters", "Why It Matters?")}
          </span>
        </h2>

        {/* DESCRIPTION 1 */}
        <p className="text-xl text-gray-400 text-center mt-8 mb-24">
          {t(
            "whyItMattersDesc",
            "Scams are getting smarter — and more personal. From fake voices of loved ones to official-looking emails, fraudsters are finding new ways to trick people every day."
          )}
        </p>

        {/* SECTION TITLE 2 */}
        <h2
          className="text-3xl md:text-4xl font-extrabold text-center mb-2"
          style={{ fontFamily: "Outfit, Arial, sans-serif" }}
        >
          <span className="inline-block border-b-8 border-[#5c52ff] pb-1 px-4">
            {t("whyShouldYouCare", "Why Should You Care?")}
          </span>
        </h2>

        {/* DESCRIPTION 2 */}
        <p className="text-xl text-gray-400 text-center mt-8">
          {t(
            "whyShouldYouCareDesc",
            "Because it can happen to anyone — especially our parents, grandparents, or even you. Losing money is just one part. It’s the stress, the trust broken, and the helplessness that stays longer."
          )}
        </p>

      </div>
    </div>
  );
}
