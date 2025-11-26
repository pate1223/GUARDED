import React, { useState, lazy, Suspense } from 'react';
import Logo from './assets/logo.png';
import Home from './Home';
import SignIn from './SignIn';
import ThemeToggle from './ThemeToggle';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import LoadingSpinner from './components/LoadingSpinner';
import FeedbackFab from './FeedbackFab';

// Lazy load heavy components for better performance
const WhyItMatters = lazy(() => import('./WhyItMatters'));
const TypesOfScams = lazy(() => import('./TypesOfScams'));
const QuizDashboard = lazy(() => import('./components/QuizDashboard'));
const Learn = lazy(() => import('./Learn'));
const OnlineScams = lazy(() => import('./OnlineScams'));
const CallScams = lazy(() => import('./CallScams'));
const EmailScams = lazy(() => import('./EmailScams'));
const Dashboard = lazy(() => import('./Dashboard'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const Achievements = lazy(() => import('./components/Achievements'));

// Translations for EN and FR
const translations = {
  EN: {
    // Navigation
    learn: "Learn",
    quizzes: "Quizzes",
    info: "Info",
    home: "Home",
    signIn: "Sign in",
    profile: "Profile",
    achievements: "Achievements",
    admin: "Access Admin Dashboard",
    logOut: "Log out",
    signedInAs: "Signed in as",

    // Home
    staySafe: "Stay Safe",
    defend: "Defend Yourself",
    against: "Against Online Scams",
    getStarted: "Get Started",
    welcomeToGuardED: "Welcome to GuardED!",
    learnProtect: "Learn how to protect yourself against online scams and stay safe online.",
    startLearning: "Start Learning",

    // Learn - Hero
    learnHowOutsmart: "Learn How to Outsmart Scams",
    interactiveLessons: "Interactive lessons and short guides that teach you to recognize, avoid, and prevent fraud in everyday life.",

    // Learn - Mode Choice
    chooseLearningMode: "Choose Your Learning Mode",
    pickLearningStyle: "Pick a learning style to begin your journey.",
    directedLearning: "Directed Learning",
    freeLearning: "Free Learning",

    // Directed Learning
    welcomeDirected: "Welcome to Directed Learning",
    structuredPath: "Follow a structured, step-by-step path to master scam detection. Each module builds on the last, unlocking new content as you progress.",
    whatYouLearn: "What You'll Learn:",
    emailScams: "Email Scams",
    identifyPhishing: "Identify phishing and fake emails",
    callScams: "Call Scams",
    detectFraud: "Detect fraudulent phone calls",
    onlineScams: "Online Scams",
    spotFakeWebsites: "Spot fake websites and offers",
    startJourney: "Start Your Journey",
    back: "Back",

    // Learning Path
    yourLearningPath: "Your Learning Path",
    completeModules: "Complete each module to unlock the next. Progress through all modules to become scam-savvy!",
    backToChoice: "Back to Learning Choice",
    progress: "Progress",
    lessons: "Lessons",
    startModule: "Start Module",
    continueModule: "Continue Module",
    completeModule: "Complete Module",
    unlockPrevious: "Complete the previous module to unlock this one",
    backToModules: "Back to Modules",
    lessonOverview: "Lesson Overview",
    previousLesson: "Previous Lesson",
    nextLesson: "Next Lesson",

    // Module Titles
    emailFundamentals: "Email Scams Fundamentals",
    callPhoneFraud: "Call Scams & Phone Fraud",
    onlineDigitalSafety: "Online Scams & Digital Safety",

    // Lessons - Email Module
    whatIsPhishing: "What is Phishing?",
    phishingDesc: "Phishing is a type of online scam where attackers pretend to be legitimate organizations to steal your personal information, passwords, or financial details.",
    spottingFakeEmails: "Spotting Fake Emails",
    spottingDesc: "Learn to identify red flags: suspicious sender addresses, urgent language, spelling errors, generic greetings, and requests for sensitive information.",
    protectingYourself: "Protecting Yourself",
    protectingDesc: "Best practices: verify sender identity, don't click suspicious links, use spam filters, enable two-factor authentication, and report phishing attempts.",

    // Lessons - Call Module
    phoneTactics: "Common Phone Scam Tactics",
    phoneTacticsDesc: "Scammers use urgency, threats, and impersonation to manipulate victims. They may claim to be from the IRS, tech support, or banks.",
    techSupportExposed: "Tech Support Scams Exposed",
    techSupportDesc: "Fake tech support calls claim your computer has a virus and request remote access. Legitimate companies never call unsolicited.",
    respondSafely: "How to Respond Safely",
    respondDesc: "Hang up immediately, verify caller identity independently, never share personal info, and report suspicious calls to authorities.",

    // Lessons - Online Module
    identifyFakeWebsites: "Identifying Fake Websites",
    fakeWebsitesDesc: "Check for HTTPS, look for trust seals, verify domain spelling, watch for poor design, and research company legitimacy.",
    socialMediaPrevention: "Social Media Scam Prevention",
    socialMediaDesc: "Be wary of too-good-to-be-true offers, fake friend requests, phishing links, romance scams, and cryptocurrency schemes.",
    safeOnlineShopping: "Safe Online Shopping",
    safeShoppingDesc: "Use secure payment methods, research sellers, check reviews, avoid wire transfers, and be cautious of deals that seem too good to be true.",

    // Free Learning
    exploreCategories: "Explore Scam Categories",
    chooseScamType: "Choose a type of scam to explore its learning library.",
    emailScamsTitle: "Email Scams",
    spotPhishingEmails: "Spot phishing emails and fake attachments.",
    callScamsTitle: "Call Scams",
    detectFakeTech: "Detect fake tech support and suspicious phone calls.",
    onlineScamsTitle: "Online Scams",
    identifyFakeWebsitesShort: "Identify fake websites, phishing links, and fraudulent offers.",

    // Libraries
    learningLibraries: "Learning Libraries",
    recognizePhishing: "Recognizing Phishing Emails",
    recognizePhishingDesc: "Learn the red flags and real examples of phishing attempts.",
    avoidAttachments: "Avoiding Malicious Attachments",
    avoidAttachmentsDesc: "Understand the dangers of unsafe attachments and fake invoices.",
    identifySpoofed: "Identifying Spoofed Senders",
    identifySpoofedDesc: "Spot fake 'from' addresses and impersonation attempts.",

    phoneScripts: "Common Phone Scam Scripts",
    phoneScriptsDesc: "Review real-world scam call recordings and how to respond safely.",
    techAwareness: "Tech Support Scam Awareness",
    techAwarenessDesc: "Learn how fake tech support calls trick victims into revealing info.",
    protectSeniors: "Protecting Seniors from Call Scams",
    protectSeniorsDesc: "Tips and guides to help older adults recognize phone fraud.",

    safeShopping: "Safe Online Shopping",
    safeShoppingLibDesc: "How to identify safe vs fake e-commerce sites.",
    socialMediaScams: "Social Media Scam Prevention",
    socialMediaDesc2: "Avoid scams and fake links on major platforms.",
    fakeJobOffers: "Recognizing Fake Job Offers",
    fakeJobOffersDesc: "Detect employment scams and fraudulent recruiters.",

    // Courses
    courses: "Courses",
    emailSecurityBasics: "Email Security Basics",
    emailSecurityDesc: "Spot phishing emails, malicious links, and fake attachments.",
    callScamSafety: "Call Scam Safety Basics",
    callScamSafetyDesc: "Spot fake tech support and suspicious phone calls.",
    onlineScamDetection: "Online Scam Detection",
    onlineScamDetectionDesc: "Learn how to spot fake websites and fraudulent offers.",
    viewDetails: "View Details",
    start: "Start",
    continueLearning: "Continue Learning",

    // Levels & Times
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    minutes: "mins",
    minsTotal: "mins total",

    // Quiz Section
    browseQuizzes: "Browse Quizzes",
    completedQuizzes: "Completed Quizzes",
    startQuiz: "Start",
    retryQuiz: "Retry Quiz",
    exitQuiz: "Exit Quiz",
    submitQuiz: "Submit Quiz",
    quizResults: "Quiz Results",
    score: "Score",
    percentage: "Percentage",
    timeTaken: "Time Taken",
    timeLeft: "Time Left",
    question: "Question",
    yourAnswer: "Your Answer",
    correctAnswer: "Correct Answer",
    correct: "✓ Correct",
    incorrect: "✗ Incorrect",
    answered: "Answered",
    notAnswered: "Not answered",
    reviewAnswers: "Review Answers",
    backToQuizzes: "Back to Quizzes",
    continueLearningQuiz: "Continue Learning",
    searchQuizzes: "Search quizzes...",
    allCategories: "All Categories",
    clearFilters: "Clear Filters",
    noQuizzesMatch: "No quizzes match your search criteria. Try adjusting your filters.",
    noNewQuizzes: "No new quizzes available right now.",
    noCompletedQuizzes: "You haven't completed any quizzes yet.",
    noCompletedMatch: "No completed quizzes match your search criteria.",
    completedBadge: "✔ Completed",
    newBadge: "✨ New",
    previous: "Previous",
    next: "Next",

    // Results Messages
    outstandingPerformance: "🎊 Outstanding Performance! 🎊",
    greatJob: "🌟 Great Job! 🌟",
    wellDone: "✅ Well Done! ✅",
    keepPracticing: "💪 Keep Practicing! 💪",
    youCrushedIt: "You absolutely crushed it!",
    youDidWell: "You did really well!",
    youPassed: "You passed the quiz!",
    everyAttempt: "Every attempt makes you stronger!",
    excellentMaster: "Excellent - You're a quiz master!",
    goodKnowStuff: "Good - You really know your stuff!",
    passKeepGoing: "Pass - Keep up the good work!",
    tryAgainPractice: "Try Again - Practice makes perfect!",
    newBadgesEarned: "New Badges Earned!",
    congratsAchievement: "Congratulations on your achievement!",
    answerReview: "Answer Review",
    seeHowYouDid: "See how you did on each question",
    totalScore: "Total Score",
    accuracy: "Accuracy",
    hurry: "⚠️ Hurry!",
    questionNotAvailable: "Question not available",
    optionsNotAvailable: "Question options are not available. Please try refreshing the page.",
    loadingQuiz: "Loading Quiz...",
    pleaseWait: "Please wait while we load the quiz questions.",
    submitting: "Submitting...",

    // Authentication
    everyClickMatters: "Every click matters.",
    learnClickSmart: "Learn to click smart.",
    login: "Login",
    createAccount: "Create Account",
    welcomeBack: "Welcome Back!",
    signInToContinue: "Sign in to continue",
    enterEmail: "Enter Email Id",
    enterPassword: "Enter Password",
    enterFullName: "Enter Full Name",
    forgotPassword: "Forgot password?",
    signingIn: "Signing in...",
    orContinueWith: "Or continue with",
    iAgreeToTerms: "I Agree to",
    termsAndConditions: "terms and conditions",
    creatingAccount: "Creating Account...",
    signUp: "Sign up",
    welcomeToGuardEd: "Welcome to",
    signUpToContinue: "Sign up to continue",

    // Error Messages
    userNotFoundDb: "User not found in database. Please contact support.",
    loginFailed: "Login failed. Please try again.",
    googleSignInFailed: "Google sign-in failed. Please try again.",
    facebookSignInFailed: "Facebook sign-in failed. Please try again.",
    userNotFoundRegister: "User not found in database. Please register first.",
    agreeToTermsError: "Please agree to terms and conditions.",
    registrationFailed: "Registration failed. Please try again.",

    // Online Scams Page — (CLEANED, NO DUPLICATES)
    protectYourselfOnline: "Protect Yourself from Online Scams",
    onlineScamsIntro: "Online scams are some of the most common ways fraudsters trick people into giving up money, personal information, or account access. Learn how to recognize, avoid, and protect yourself against these threats.",
    phishingWebsites: "Phishing Websites",
    phishingTip1: "Look for misspelled URLs or odd domain names.",
    phishingTip2: "Check for HTTPS and a padlock in the browser bar.",
    phishingTip3: "Never enter sensitive info on a site you arrived at through an email or text link.",
    example: "Example:",
    phishingExample: 'A scammer creates a fake "PayPal" site like paypa1-security.com and asks you to log in.',
    onlineShoppingScams: "Online Shopping Scams",
    shoppingScamsDesc: "Fraudulent sellers set up fake e-commerce stores...",
    shoppingTip1: 'Be wary of deals that look "too good to be true."',
    shoppingTip2: "Research the seller — look for reviews and a real business address.",
    shoppingTip3: "Use secure payment methods like credit cards, not wire transfer.",
    shoppingExample: 'An Instagram ad promotes "50% off iPhones"...',
    techSupportScams: "Tech Support Scams",
    techTip1: "Ignore urgent pop-ups...",
    techTip2: "Real companies like Microsoft or Apple do not send unsolicited warnings.",
    techTip3: "Do not give strangers remote access to your computer.",
    techExample: 'A browser pop-up says "Your computer is infected!"',
    socialMediaScamsDesc: "Scammers use social platforms to spread fake giveaways...",
    socialTip1: "Verify requests for money...",
    socialTip2: "Be cautious of links shared in DMs or group chats.",
    socialTip3: "Report and block fake accounts immediately.",
    socialExample: 'You get a message from a "friend"...',
    staySafeOnline: "Stay Safe Online",
    bestDefense: "The best defense against scams is awareness...",
    takeQuickQuiz: "Take a Quick Quiz",

    // Call Scams Page — (CLEANED)
    protectYourselfFromCalls: "Protect Yourself from Call Scams",
    callScamsIntro: "Call scams are a common method...",
    impersonationScams: "Impersonation Scams",
    impersonationDesc: "Scammers may pretend to be government officials...",
    impersonationTip1: "Never give personal info over the phone...",
    impersonationTip2: "Verify the caller's identity...",
    impersonationTip3: "Hang up if pressured...",
    impersonationExample: "A caller claims to be from the CRA...",
    techSupportCallScams: "Tech Support Scams",
    techSupportCallDesc: "Scammers pretend your computer is infected...",
    techSupportCallTip1: "Ignore unsolicited tech support calls.",
    techSupportCallTip2: "Never grant remote access...",
    techSupportCallTip3: "Do not pay for unnecessary services.",
    techSupportCallExample: "A pop-up instructs you...",
    prizeLotteryScams: "Prize and Lottery Scams",
    prizeLotteryDesc: "Scammers claim you won a prize...",
    prizeLotteryTip1: "Be skeptical of unexpected calls...",
    prizeLotteryTip2: "Legitimate prizes don't require fees.",
    prizeLotteryTip3: "Do not share banking info.",
    prizeLotteryExample: "You get a call saying you won...",
    threateningScams: "Threatening Scams",
    threateningDesc: "Scammers use fear tactics...",
    threateningTip1: "Stay calm.",
    threateningTip2: "Verify claims.",
    threateningTip3: "Report threatening calls.",
    threateningExample: "A caller claims you will be arrested...",
    staySafeFromCalls: "Stay Safe from Call Scams",
    callScamsAwareness: "Awareness is the best defense...",

    // Email Scams Page — (CLEANED)
    protectYourselfFromEmails: "Protect Yourself from Email Scams",
    emailScamsIntro: "Email scams, often called phishing...",
    phishingEmails: "Phishing Emails",
    phishingEmailsDesc: "Fraudsters send emails pretending...",
    phishingEmailTip1: "Check sender addresses carefully...",
    phishingEmailTip2: "Do not click links...",
    phishingEmailTip3: "Verify requests for sensitive info...",
    phishingEmailExample: "An email pretending to be from your bank...",
    fakeInvoiceScams: "Fake Invoice Scams",
    fakeInvoiceDesc: "Scammers send invoices...",
    fakeInvoiceTip1: "Double-check invoices...",
    fakeInvoiceTip2: "Do not make payments...",
    fakeInvoiceTip3: "Report suspicious invoices...",
    fakeInvoiceExample: "You receive a PDF invoice...",
    malwareAttachments: "Malware Attachments",
    malwareAttachmentsDesc: "Emails may include attachments...",
    malwareTip1: "Never open attachments...",
    malwareTip2: "Scan attachments...",
    malwareTip3: "Keep your software...",
    malwareExample: "A seemingly legitimate email...",
    impersonationEmails: "Impersonation Emails",
    impersonationEmailsDesc: "Scammers impersonate colleagues...",
    impersonationEmailTip1: "Verify unexpected requests...",
    impersonationEmailTip2: "Be cautious of urgency...",
    impersonationEmailTip3: "Report impersonation attempts...",
    impersonationEmailExample: "An email from \"your CEO\"...",
    staySafeFromEmails: "Stay Safe from Email Scams",
    emailScamsAwareness: "Awareness is the best defense...",

    // Why It Matters
    whyItMatters: "Why It Matters?",
    whyItMattersDesc: "Scams are getting smarter...",
    whyShouldYouCare: "Why Should You Care?",
    whyShouldYouCareDesc: "Because it can happen to anyone...",

    // Types of Scams
    typesOfScamsTitle: "TYPES OF SCAMS",
    emailScamsShort: "EMAIL SCAMS",
    emailScamsShortDesc: "Fraudsters disguise as trusted sources...",
    callScamsShort: "CALL SCAMS",
    callScamsShortDesc: "Scammers use fake identities...",
    onlineScamsShort: "ONLINE SCAMS",
    onlineScamsShortDesc: "From fake websites to offers...",

    // Footer
    allRightsReserved: "All rights reserved",
  },

FR: {
  // Navigation
  learn: "Apprendre",
  quizzes: "Quiz",
  info: "Infos",
  home: "Accueil",
  signIn: "Se connecter",
  profile: "Profil",
  achievements: "Réalisations",
  admin: "Accéder au tableau de bord admin",
  logOut: "Se déconnecter",
  signedInAs: "Connecté en tant que",

  // Home
  staySafe: "Restez en sécurité",
  defend: "Défendez-vous",
  against: "Contre les arnaques en ligne",
  getStarted: "Commencer",
  welcomeToGuardED: "Bienvenue sur GuardED!",
  learnProtect: "Apprenez à vous protéger contre les arnaques en ligne et à rester en sécurité en ligne.",
  startLearning: "Commencer à apprendre",

  // Learn - Hero
  learnHowOutsmart: "Apprenez à déjouer les arnaques",
  interactiveLessons: "Des leçons interactives et des guides courts qui vous apprennent à reconnaître, éviter et prévenir la fraude au quotidien.",

  // Learn - Mode Choice
  chooseLearningMode: "Choisissez votre mode d'apprentissage",
  pickLearningStyle: "Choisissez un style d'apprentissage pour commencer votre parcours.",
  directedLearning: "Apprentissage dirigé",
  freeLearning: "Apprentissage libre",

  // Directed Learning
  welcomeDirected: "Bienvenue à l'apprentissage dirigé",
  structuredPath: "Suivez un parcours structuré, étape par étape, pour maîtriser la détection des arnaques. Chaque module s'appuie sur le précédent, déverrouillant de nouveaux contenus au fur et à mesure.",
  whatYouLearn: "Ce que vous apprendrez:",
  emailScams: "Arnaques par email",
  identifyPhishing: "Identifier le phishing et les faux emails",
  callScams: "Arnaques téléphoniques",
  detectFraud: "Détecter les appels frauduleux",
  onlineScams: "Arnaques en ligne",
  spotFakeWebsites: "Repérer les faux sites et offres",
  startJourney: "Commencer votre parcours",
  back: "Retour",

  // Learning Path
  yourLearningPath: "Votre parcours d'apprentissage",
  completeModules: "Complétez chaque module pour débloquer le suivant. Progressez à travers tous les modules pour devenir expert en arnaques!",
  backToChoice: "Retour au choix d'apprentissage",
  progress: "Progression",
  lessons: "Leçons",
  startModule: "Commencer le module",
  continueModule: "Continuer le module",
  completeModule: "Terminer le module",
  unlockPrevious: "Complétez le module précédent pour débloquer celui-ci",
  backToModules: "Retour aux modules",
  lessonOverview: "Aperçu de la leçon",
  previousLesson: "Leçon précédente",
  nextLesson: "Leçon suivante",

  // Module Titles
  emailFundamentals: "Fondamentaux des arnaques par email",
  callPhoneFraud: "Arnaques téléphoniques et fraude",
  onlineDigitalSafety: "Arnaques en ligne et sécurité numérique",

  // Lessons – Email Module
  whatIsPhishing: "Qu'est-ce que le phishing?",
  phishingDesc: "Le phishing est un type d'arnaque où les fraudeurs imitent des organisations légitimes pour voler des informations personnelles ou financières.",
  spottingFakeEmails: "Repérer les faux emails",
  spottingDesc: "Apprenez à identifier les signaux d'alarme : adresses suspectes, langage urgent, fautes d'orthographe, salutations génériques et demandes d'informations sensibles.",
  protectingYourself: "Vous protéger",
  protectingDesc: "Vérifiez l'expéditeur, n'ouvrez pas les liens suspects, utilisez des filtres anti-spam, activez la 2FA et signalez le phishing.",

  // Lessons – Call Module
  phoneTactics: "Tactiques courantes d'arnaque téléphonique",
  phoneTacticsDesc: "Les arnaqueurs utilisent l'urgence, les menaces et l'usurpation d'identité pour manipuler leurs victimes.",
  techSupportExposed: "Arnaques au support technique démasquées",
  techSupportDesc: "Les faux appels techniques prétendent que votre ordinateur a un virus et demandent un accès à distance.",
  respondSafely: "Comment répondre en toute sécurité",
  respondDesc: "Raccrochez immédiatement, vérifiez l'identité de l'appelant et signalez les appels suspects.",

  // Lessons – Online Module
  identifyFakeWebsites: "Identifier les faux sites web",
  fakeWebsitesDesc: "Vérifiez le HTTPS, les sceaux de confiance, l'orthographe du domaine et la légitimité du site.",
  socialMediaPrevention: "Prévention des arnaques sur les réseaux sociaux",
  socialMediaDesc: "Méfiez-vous des offres trop belles, des faux profils, des liens suspects et des arnaques crypto.",
  safeOnlineShopping: "Achats en ligne sécurisés",
  safeShoppingDesc: "Utilisez des paiements sécurisés, vérifiez les vendeurs, recherchez les avis et évitez les virements.",

  // Free Learning
  exploreCategories: "Explorer les catégories d'arnaques",
  chooseScamType: "Choisissez un type d'arnaque pour explorer la bibliothèque.",
  emailScamsTitle: "Arnaques par email",
  spotPhishingEmails: "Repérer les emails de phishing et les fausses pièces jointes.",
  callScamsTitle: "Arnaques téléphoniques",
  detectFakeTech: "Détecter le faux support technique et les appels suspects.",
  onlineScamsTitle: "Arnaques en ligne",
  identifyFakeWebsitesShort: "Identifier les faux sites web, liens de phishing et offres frauduleuses.",

  // Libraries
  learningLibraries: "Bibliothèques d'apprentissage",
  recognizePhishing: "Reconnaître le phishing",
  recognizePhishingDesc: "Signaux d'alarme et exemples réels.",
  avoidAttachments: "Éviter les pièces jointes malveillantes",
  avoidAttachmentsDesc: "Comprendre les dangers des pièces suspectes.",
  identifySpoofed: "Identifier les expéditeurs usurpés",
  identifySpoofedDesc: "Repérer les fausses adresses et tentatives d'usurpation.",

  phoneScripts: "Scripts téléphoniques courants",
  phoneScriptsDesc: "Exemples d'appels frauduleux et comment réagir.",
  techAwareness: "Sensibilisation au support technique frauduleux",
  techAwarenessDesc: "Comprendre comment les fraudeurs manipulent les victimes.",
  protectSeniors: "Protéger les seniors",
  protectSeniorsDesc: "Aider les personnes âgées à reconnaître les arnaques téléphoniques.",

  safeShopping: "Achats en ligne sécurisés",
  safeShoppingLibDesc: "Identifier les vrais sites vs les faux.",
  socialMediaScams: "Arnaques sur les réseaux sociaux",
  socialMediaDesc2: "Éviter les faux liens et escroqueries.",
  fakeJobOffers: "Fausses offres d'emploi",
  fakeJobOffersDesc: "Repérer les recruteurs frauduleux.",

  // Courses
  courses: "Cours",
  emailSecurityBasics: "Bases de la sécurité email",
  emailSecurityDesc: "Repérer les emails de phishing et pièces jointes suspectes.",
  callScamSafety: "Sécurité des appels téléphoniques",
  callScamSafetyDesc: "Détecter les faux appels et le support frauduleux.",
  onlineScamDetection: "Détection des arnaques en ligne",
  onlineScamDetectionDesc: "Repérer les faux sites et offres frauduleuses.",
  viewDetails: "Voir les détails",
  start: "Commencer",
  continueLearning: "Continuer l'apprentissage",

  // Levels & Times
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
  minutes: "mins",
  minsTotal: "mins au total",

  // Quiz Section
  browseQuizzes: "Parcourir les quiz",
  completedQuizzes: "Quiz complétés",
  startQuiz: "Commencer",
  retryQuiz: "Réessayer",
  exitQuiz: "Quitter",
  submitQuiz: "Soumettre",
  quizResults: "Résultats du quiz",
  score: "Score",
  percentage: "Pourcentage",
  timeTaken: "Temps écoulé",
  timeLeft: "Temps restant",
  question: "Question",
  yourAnswer: "Votre réponse",
  correctAnswer: "Réponse correcte",
  correct: "✓ Correct",
  incorrect: "✗ Incorrect",
  answered: "Répondu",
  notAnswered: "Non répondu",
  reviewAnswers: "Réviser les réponses",
  backToQuizzes: "Retour aux quiz",
  continueLearningQuiz: "Continuer l'apprentissage",
  searchQuizzes: "Rechercher des quiz...",
  allCategories: "Toutes les catégories",
  clearFilters: "Effacer les filtres",
  noQuizzesMatch: "Aucun quiz ne correspond à votre recherche.",
  noNewQuizzes: "Aucun nouveau quiz disponible.",
  noCompletedQuizzes: "Vous n'avez pas encore complété de quiz.",
  noCompletedMatch: "Aucun quiz complété ne correspond.",
  completedBadge: "✔ Complété",
  newBadge: "✨ Nouveau",
  previous: "Précédent",
  next: "Suivant",

  // Quiz Results Messages
  outstandingPerformance: "🎊 Performance exceptionnelle! 🎊",
  greatJob: "🌟 Excellent travail! 🌟",
  wellDone: "✅ Bien joué! ✅",
  keepPracticing: "💪 Continuez à pratiquer!",
  youCrushedIt: "Vous avez tout déchiré!",
  youDidWell: "Vous avez très bien fait!",
  youPassed: "Vous avez réussi!",
  everyAttempt: "Chaque tentative vous rend plus fort!",
  excellentMaster: "Excellent — Vous maîtrisez le sujet!",
  goodKnowStuff: "Bien — Vous connaissez votre sujet!",
  passKeepGoing: "Réussi — Continuez!",
  tryAgainPractice: "Réessayez — La pratique mène à la maîtrise!",
  newBadgesEarned: "Nouveaux badges obtenus!",
  congratsAchievement: "Félicitations!",
  answerReview: "Révision des réponses",
  seeHowYouDid: "Voyez comment vous avez fait",
  totalScore: "Score total",
  accuracy: "Précision",
  hurry: "⚠️ Dépêchez-vous!",
  questionNotAvailable: "Question non disponible",
  optionsNotAvailable: "Options non disponibles.",
  loadingQuiz: "Chargement du quiz...",
  pleaseWait: "Veuillez patienter...",
  submitting: "Envoi en cours...",

  // Authentication
  everyClickMatters: "Chaque clic compte.",
  learnClickSmart: "Apprenez à cliquer intelligemment.",
  login: "Connexion",
  createAccount: "Créer un compte",
  welcomeBack: "Bon retour!",
  signInToContinue: "Connectez-vous pour continuer",
  enterEmail: "Entrez votre adresse email",
  enterPassword: "Entrez votre mot de passe",
  enterFullName: "Entrez votre nom complet",
  forgotPassword: "Mot de passe oublié?",
  signingIn: "Connexion...",
  orContinueWith: "Ou continuer avec",
  iAgreeToTerms: "J'accepte les",
  termsAndConditions: "termes et conditions",
  creatingAccount: "Création du compte...",
  signUp: "S'inscrire",
  welcomeToGuardEd: "Bienvenue sur",
  signUpToContinue: "Inscrivez-vous pour continuer",

  // Errors
  userNotFoundDb: "Utilisateur introuvable.",
  loginFailed: "Échec de connexion.",
  googleSignInFailed: "Connexion Google échouée.",
  facebookSignInFailed: "Connexion Facebook échouée.",
  userNotFoundRegister: "Veuillez vous inscrire.",
  agreeToTermsError: "Veuillez accepter les termes.",
  registrationFailed: "Échec de l'inscription.",

  // Online Scams Page — CLEANED
  protectYourselfOnline: "Protégez-vous contre les arnaques en ligne",
  onlineScamsIntro: "Les arnaques en ligne sont parmi les méthodes les plus courantes utilisées pour voler argent et informations.",
  phishingWebsites: "Sites web de phishing",
  phishingTip1: "Recherchez les URL mal orthographiées.",
  phishingTip2: "Vérifiez la présence de HTTPS.",
  phishingTip3: "N'entrez jamais d'informations sensibles après un lien email.",
  example: "Exemple:",
  phishingExample: 'Un faux site "PayPal" comme paypa1-security.com.',
  onlineShoppingScams: "Arnaques d'achats en ligne",
  shoppingScamsDesc: "De faux magasins proposent des offres trop belles pour être vraies.",
  shoppingTip1: "Méfiez-vous des offres trop belles.",
  shoppingTip2: "Recherchez des avis et une adresse réelle.",
  shoppingTip3: "Utilisez des paiements sécurisés.",
  shoppingExample: "Une publicité Instagram frauduleuse.",
  techSupportScams: "Arnaques au support technique",
  techTip1: "Ignorez les pop-ups urgents.",
  techTip2: "Microsoft/Apple n'envoient jamais d'avertissements.",
  techTip3: "Ne donnez jamais l'accès à distance.",
  techExample: "Pop-up de faux virus.",
  socialMediaScamsDesc: "Arnaques sur réseaux sociaux.",
  socialTip1: "Vérifiez les demandes d'argent.",
  socialTip2: "Méfiez-vous des liens en messages privés.",
  socialTip3: "Bloquez les faux comptes.",
  socialExample: "Message d'un ami piraté.",
  staySafeOnline: "Restez en sécurité en ligne",
  bestDefense: "La sensibilisation est votre meilleure défense.",
  takeQuickQuiz: "Faire un quiz rapide",

  // Call Scams Page — CLEANED
  protectYourselfFromCalls: "Protégez-vous contre les arnaques téléphoniques",
  callScamsIntro: "Les escrocs utilisent les appels pour voler argent et données.",
  impersonationScams: "Usurpation d'identité",
  impersonationDesc: "Les escrocs imitent des autorités officielles.",
  impersonationTip1: "Ne partagez jamais d'informations.",
  impersonationTip2: "Vérifiez via des canaux officiels.",
  impersonationTip3: "Raccrochez en cas de pression.",
  impersonationExample: "Faux appel de l'ARC.",
  techSupportCallScams: "Arnaques au support technique",
  techSupportCallDesc: "Faux techniciens qui réclament un accès à distance.",
  techSupportCallTip1: "Ignorez les appels non sollicités.",
  techSupportCallTip2: "N'accordez jamais l'accès.",
  techSupportCallTip3: "Ne payez rien.",
  techSupportCallExample: "Pop-up vous forçant à appeler.",
  prizeLotteryScams: "Arnaques aux loteries",
  prizeLotteryDesc: "On vous dit que vous avez gagné un prix.",
  prizeLotteryTip1: "Méfiez-vous des gains inattendus.",
  prizeLotteryTip2: "Les vrais prix n'exigent pas de frais.",
  prizeLotteryTip3: "Ne partagez jamais vos informations.",
  prizeLotteryExample: "Fausse loterie à 5 000 $.",
  threateningScams: "Arnaques par menaces",
  threateningDesc: "Les fraudeurs utilisent la peur.",
  threateningTip1: "Restez calme.",
  threateningTip2: "Vérifiez les affirmations.",
  threateningTip3: "Signalez l'appel.",
  threateningExample: "Menaces d'arrestation.",
  staySafeFromCalls: "Restez en sécurité",
  callScamsAwareness: "La sensibilisation est la meilleure défense.",

  // Email Scams Page — CLEANED
  protectYourselfFromEmails: "Protégez-vous des arnaques par courriel",
  emailScamsIntro: "Les arnaques par courriel cherchent à voler des informations sensibles.",
  phishingEmails: "Courriels de phishing",
  phishingEmailsDesc: "Les fraudeurs imitent des banques ou entreprises.",
  phishingEmailTip1: "Vérifiez l'adresse de l'expéditeur.",
  phishingEmailTip2: "Ne cliquez pas sur des liens.",
  phishingEmailTip3: "Vérifiez toujours via des canaux officiels.",
  phishingEmailExample: "Courriel frauduleux de banque.",
  fakeInvoiceScams: "Fausses factures",
  fakeInvoiceDesc: "Factures pour des achats inexistants.",
  fakeInvoiceTip1: "Confirmez auprès de l'entreprise.",
  fakeInvoiceTip2: "Ne payez pas d'expéditeurs inconnus.",
  fakeInvoiceTip3: "Signalez la tentative.",
  fakeInvoiceExample: "Fausse facture PDF.",
  malwareAttachments: "Pièces jointes malveillantes",
  malwareAttachmentsDesc: "Pièces contenant virus ou ransomware.",
  malwareTip1: "N'ouvrez jamais une pièce jointe inattendue.",
  malwareTip2: "Analysez les fichiers.",
  malwareTip3: "Gardez votre système à jour.",
  malwareExample: "PDF malveillant.",
  impersonationEmails: "Usurpation d'identité",
  impersonationEmailsDesc: "Les escrocs imitent collègues ou dirigeants.",
  impersonationEmailTip1: "Vérifiez directement auprès de la personne.",
  impersonationEmailTip2: "Méfiez-vous des urgences.",
  impersonationEmailTip3: "Signalez l'incident.",
  impersonationEmailExample: "Faux email du PDG.",
  staySafeFromEmails: "Restez prudent",
  emailScamsAwareness: "La sensibilisation protège contre les arnaques.",

  // Why It Matters
  whyItMatters: "Pourquoi est-ce important?",
  whyItMattersDesc: "Les arnaques deviennent plus avancées et personnelles.",
  whyShouldYouCare: "Pourquoi s'en soucier?",
  whyShouldYouCareDesc: "Cela peut arriver à n'importe qui.",

  // Types of Scams
  typesOfScamsTitle: "TYPES D'ARNAQUES",
  emailScamsShort: "ARNAQUES COURRIEL",
  emailScamsShortDesc: "Des sources de confiance imitées.",
  callScamsShort: "ARNAQUES TÉLÉPHONIQUES",
  callScamsShortDesc: "Faux agents et usurpation d'identité.",
  onlineScamsShort: "ARNAQUES EN LIGNE",
  onlineScamsShortDesc: "Faux sites et offres frauduleuses.",

  // Footer
  allRightsReserved: "Tous droits réservés",
}

};

// i18n function
function i18n(lang, key) {
  return translations[lang][key] || key;
}

function AppContent() {
  const [lang, setLang] = useState(() => {
    // Load language from localStorage on initial render
    return localStorage.getItem('guarded_language') || 'EN';
  });
  const [view, setView] = useState('home');
  const [showLang, setShowLang] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { loading, error, isAuthenticated, user, isAdmin } = useAuth();

  // Save language preference to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('guarded_language', lang);
  }, [lang]);

  // Firebase initialization states
  if (loading) {
    return <LoadingSpinner message="Initializing GuardEd..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-purple-500/20 border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Initialization Error</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#5c52ff] dark:bg-purple-600 text-white rounded-lg hover:bg-[#4335d1] dark:hover:bg-purple-500 transition-all duration-300 shadow-lg dark:shadow-purple-500/30"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (view === 'signin') {
    return <SignIn onBack={() => setView('home')} lang={lang} i18n={i18n} />;
  }

  return (
<div className="relative w-full bg-white text-black min-h-screen flex flex-col border-none p-0 m-0">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-[#5c52ff] focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5c52ff] dark:focus:ring-offset-gray-900"
      >
        Skip to main content
      </a>

      {/* Top bar */}
<header className="fixed top-6 z-50 w-full max-w-5xl left-1/2 -translate-x-1/2 flex items-center px-8 py-5 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-full transition-all duration-300">
        <div className="flex items-center mr-8">
          <div className="w-16 h-16 bg-white dark:bg-gray-700 border border-purple-200 dark:border-purple-500/50 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm dark:shadow-purple-500/20">
            <img src={Logo} alt="GuardED Logo - Security awareness platform" className="w-10 h-10" />
          </div>
          <span className="ml-3 text-[#5c52ff] dark:text-purple-400 font-extrabold text-xl transition-colors duration-300">GuardEd</span>
        </div>

        {/* Navigation */}
        <nav className="flex gap-12 items-center text-xl font-medium text-gray-700 dark:text-gray-300 flex-1 justify-center" role="navigation" aria-label="Main navigation">
          <button
            className={`hover:text-[#5c52ff] dark:hover:text-purple-400 transition focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded px-2 py-1 ${view === 'home' ? 'text-[#5c52ff] dark:text-purple-400 font-bold underline' : ''}`}
            onClick={() => setView('home')}
            aria-label="Go to home page"
            aria-current={view === 'home' ? 'page' : undefined}
          >
            {i18n(lang, "home")}
          </button>
          <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
          <button
            className={`hover:text-[#5c52ff] dark:hover:text-purple-400 transition focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded px-2 py-1 ${view === 'learn' ? 'text-[#5c52ff] dark:text-purple-400 font-bold underline' : ''}`}
            onClick={() => setView('learn')}
            aria-label="Go to learn page"
            aria-current={view === 'learn' ? 'page' : undefined}
          >
            {i18n(lang, "learn")}
          </button>
          <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
          <button
            className={`hover:text-[#5c52ff] dark:hover:text-purple-400 transition focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded px-2 py-1 ${view === 'quiz' ? 'text-[#5c52ff] dark:text-purple-400 font-bold underline' : ''}`}
            onClick={() => setView('quiz')}
            aria-label="Go to quizzes page"
            aria-current={view === 'quiz' ? 'page' : undefined}
          >
            {i18n(lang, "quizzes")}
          </button>
        </nav>

        {/* Sign in / User Menu */}
        <div className="ml-8 relative">
          {!isAuthenticated ? (
            <button
              className="px-6 py-3 bg-[#5c52ff] dark:bg-purple-600 text-white rounded-full font-semibold shadow-lg dark:shadow-purple-500/30 hover:bg-[#4335d1] dark:hover:bg-purple-500 transition-all duration-300 text-base focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              type="button"
              onClick={() => setView('signin')}
              aria-label="Sign in to your account"
            >
              {i18n(lang, "signIn")}
            </button>
          ) : (
            <div className="relative">
              <button
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#5c52ff] dark:bg-purple-600 text-white font-bold shadow-lg dark:shadow-purple-500/30 hover:bg-[#4335d1] dark:hover:bg-purple-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Open user menu"
                aria-expanded={showMenu}
                aria-haspopup="true"
              >
                {user?.email ? user.email[0].toUpperCase() : "U"}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl dark:shadow-purple-500/20 py-2 z-50 backdrop-blur-lg transition-colors duration-300" role="menu" aria-label="User menu">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700" role="presentation">
                    {i18n(lang, "signedInAs")} <br />
                    <span className="font-semibold text-gray-900 dark:text-white">{user?.email}</span>
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700/50 transition-colors duration-200"
                    onClick={() => {
                      setView('dashboard');
                      setShowMenu(false);
                    }}
                    role="menuitem"
                    aria-label="Go to profile page"
                  >
                    {i18n(lang, "profile")}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700/50 transition-colors duration-200"
                    onClick={() => { setView('achievements'); setShowMenu(false); }}
                    role="menuitem"
                    aria-label="View your achievements"
                  >
                    {i18n(lang, "achievements")}
                  </button>
                  {isAdmin && (
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700/50 transition-colors duration-200"
                      onClick={() => { setView('admin'); setShowMenu(false); }}
                      role="menuitem"
                      aria-label="Access admin dashboard"
                    >
                      {i18n(lang, "admin")}
                    </button>
                  )}
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:bg-red-100 dark:focus:bg-red-900/30 transition-colors duration-200"
                    onClick={async () => {
                      const { signOutUser } = await import("./services/firebase");
                      await signOutUser();
                      setView("home");
                      setShowMenu(false);
                    }}
                    role="menuitem"
                    aria-label="Log out of your account"
                  >
                    {i18n(lang, "logOut")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme + Language */}
        <div className="relative ml-4 flex items-center gap-4">
          <ThemeToggle />
          <div className="relative">
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#5c52ff] dark:border-purple-500 bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              onClick={() => setShowLang(!showLang)}
              aria-label="Change language"
              aria-expanded={showLang}
              aria-haspopup="true"
              type="button"
            >
              🌐
            </button>

            {showLang && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl dark:shadow-purple-500/20 py-2 px-4 flex flex-col gap-2 z-50 backdrop-blur-lg transition-colors duration-300" role="menu" aria-label="Language selection">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 ${lang === 'EN' ? 'bg-purple-100 dark:bg-purple-900/50 font-bold text-[#5c52ff] dark:text-purple-400' : 'hover:bg-purple-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'}`}
                  onClick={() => { setLang('EN'); setShowLang(false); }}
                  role="menuitem"
                  aria-label="Switch to English"
                  aria-current={lang === 'EN' ? 'true' : undefined}
                >
                  <span className="text-2xl" aria-hidden="true">🇬🇧</span>
                  <span className="text-lg font-semibold">EN</span>
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5c52ff] dark:focus:ring-purple-500 ${lang === 'FR' ? 'bg-purple-100 dark:bg-purple-900/50 font-bold text-[#5c52ff] dark:text-purple-400' : 'hover:bg-purple-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'}`}
                  onClick={() => { setLang('FR'); setShowLang(false); }}
                  role="menuitem"
                  aria-label="Switch to French"
                  aria-current={lang === 'FR' ? 'true' : undefined}
                >
                  <span className="text-2xl" aria-hidden="true">🇫🇷</span>
                  <span className="text-lg font-semibold">FR</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" role="main" className="pt-32">
        <Suspense fallback={<LoadingSpinner />}>
          {view === 'quiz' && <QuizDashboard lang={lang} i18n={i18n} />}
          {view === 'learn' && <Learn setView={setView} onBack={() => setView('home')} i18n={i18n} lang={lang} />}
          {view === 'home' && <Home i18n={i18n} lang={lang} />}
          {view === 'dashboard' && <Dashboard setView={setView} lang={lang} i18n={i18n} />}
          {view === 'achievements' && <Achievements lang={lang} i18n={i18n} />}
          {view === 'admin' && <AdminDashboard lang={lang} i18n={i18n} />}

          {/* Scam pages */}
          {view === 'online-scams' && <OnlineScams onBack={() => setView('learn')} lang={lang} i18n={i18n} />}
          {view === 'call-scams' && <CallScams onBack={() => setView('learn')} lang={lang} i18n={i18n} />}
          {view === 'email-scams' && <EmailScams onBack={() => setView('learn')} lang={lang} i18n={i18n} />}
        </Suspense>
      </main>

      {/* Extra sections only for Home */}
      {view === 'home' && (
        <Suspense fallback={<div className="w-full h-64 flex items-center justify-center"><LoadingSpinner /></div>}>
          <WhyItMatters lang={lang} i18n={i18n} />
          <TypesOfScams lang={lang} i18n={i18n} />
        </Suspense>
      )}

      {/* Always-available Feedback button */}
      <FeedbackFab />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;