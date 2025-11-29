// Learn page content organized for easy i18n integration

export const getDirectedLearningModules = (i18n, lang) => [
  {
    id: 1,
    title: i18n(lang, "emailFundamentals"),
    icon: "📧",
    level: i18n(lang, "beginner"),
    duration: `30 ${i18n(lang, "minutes")}`,
    lessons: [
      {
        id: 1,
        title: i18n(lang, "whatIsPhishing"),
        duration: `8 ${i18n(lang, "minutes")}`,
        content: i18n(lang, "phishingDesc"),
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        id: 2,
        title: i18n(lang, "spottingFakeEmails"),
        duration: `10 ${i18n(lang, "minutes")}`,
        content: i18n(lang, "spottingDesc"),
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        id: 3,
        title: i18n(lang, "protectingYourself"),
        duration: `12 ${i18n(lang, "minutes")}`,
        content: i18n(lang, "protectingDesc"),
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
  {
    id: 2,
    title: i18n(lang, "callPhoneFraud"),
    icon: "📞",
    level: i18n(lang, "beginner"),
    duration: `25 ${i18n(lang, "minutes")}`,
    lessons: [
      {
        id: 1,
        title: i18n(lang, "phoneTactics"),
        duration: `8 ${i18n(lang, "minutes")}`,
        content: i18n(lang, "phoneTacticsDesc"),
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        id: 2,
        title: i18n(lang, "techSupportExposed"),
        duration: `10 ${i18n(lang, "minutes")}`,
        content: i18n(lang, "techSupportDesc"),
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        id: 3,
        title: i18n(lang, "respondSafely"),
        duration: `7 ${i18n(lang, "minutes")}`,
        content: i18n(lang, "respondDesc"),
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
  {
    id: 3,
    title: i18n(lang, "onlineDigitalSafety"),
    icon: "💻",
    level: i18n(lang, "intermediate"),
    duration: `35 ${i18n(lang, "minutes")}`,
    lessons: [
      {
        id: 1,
        title: i18n(lang, "identifyFakeWebsites"),
        duration: `12 ${i18n(lang, "minutes")}`,
        content: i18n(lang, "fakeWebsitesDesc"),
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        id: 2,
        title: i18n(lang, "socialMediaPrevention"),
        duration: `10 ${i18n(lang, "minutes")}`,
        content: i18n(lang, "socialMediaDesc"),
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        id: 3,
        title: i18n(lang, "safeOnlineShopping"),
        duration: `13 ${i18n(lang, "minutes")}`,
        content: i18n(lang, "safeShoppingDesc"),
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
];

export const getCategoryContent = (i18n, lang, VIEWS) => ({
  [VIEWS.EMAIL]: {
    libraries: [
      {
        title: i18n(lang, "recognizePhishing"),
        desc: i18n(lang, "recognizePhishingDesc"),
        icon: "📨",
      },
      {
        title: i18n(lang, "avoidAttachments"),
        desc: i18n(lang, "avoidAttachmentsDesc"),
        icon: "📎",
      },
      {
        title: i18n(lang, "identifySpoofed"),
        desc: i18n(lang, "identifySpoofedDesc"),
        icon: "👀",
      },
    ],
    courses: [
      {
        title: i18n(lang, "emailSecurityBasics"),
        desc: i18n(lang, "emailSecurityDesc"),
        level: i18n(lang, "beginner"),
        time: `20 ${i18n(lang, "minsTotal")}`,
        image: "/images/email-security.jpg",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
  [VIEWS.CALL]: {
    libraries: [
      {
        title: i18n(lang, "phoneScripts"),
        desc: i18n(lang, "phoneScriptsDesc"),
        icon: "📞",
      },
      {
        title: i18n(lang, "techAwareness"),
        desc: i18n(lang, "techAwarenessDesc"),
        icon: "🧑‍💻",
      },
      {
        title: i18n(lang, "protectSeniors"),
        desc: i18n(lang, "protectSeniorsDesc"),
        icon: "👴",
      },
    ],
    courses: [
      {
        title: i18n(lang, "callScamSafety"),
        desc: i18n(lang, "callScamSafetyDesc"),
        level: i18n(lang, "beginner"),
        time: `15 ${i18n(lang, "minsTotal")}`,
        image: "/images/workplace-security.jpg",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
  [VIEWS.ONLINE]: {
    libraries: [
      {
        title: i18n(lang, "safeShopping"),
        desc: i18n(lang, "safeShoppingLibDesc"),
        icon: "🛒",
      },
      {
        title: i18n(lang, "socialMediaScams"),
        desc: i18n(lang, "socialMediaDesc2"),
        icon: "💬",
      },
      {
        title: i18n(lang, "fakeJobOffers"),
        desc: i18n(lang, "fakeJobOffersDesc"),
        icon: "💼",
      },
    ],
    courses: [
      {
        title: i18n(lang, "onlineScamDetection"),
        desc: i18n(lang, "onlineScamDetectionDesc"),
        level: i18n(lang, "intermediate"),
        time: `25 ${i18n(lang, "minsTotal")}`,
        image: "/images/digital-seniors.jpg",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
});