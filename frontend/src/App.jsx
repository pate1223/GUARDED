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
    socialMediaScamsPrevention: "Social Media Scam Prevention",
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
    exitReview: "Exit Review",
    submitQuiz: "Submit Quiz",
    quizResults: "Quiz Results",
    score: "Score",
    percentage: "Percentage",
    timeTaken: "Time Taken",
    timeLeft: "Time Left",
    question: "Question",
    of: "of",
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

    // Quiz Results Messages
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

    // Quiz Results & History
    questionOf: "Question {0} of {1}",
    yourScore: "Your Score",
    correctAnswerExclaim: "Correct Answer!",
    incorrectAnswer: "Incorrect Answer",
    explanation: "Explanation",
    loading: "Loading...",
    error: "Error",
    questionDataNotFound: "Question data not found.",
    loadingQuizResults: "Loading quiz results...",
    signInRequired: "Sign In Required",
    pleaseSignInToView: "Please sign in to view your quiz history.",
    loadingQuizHistory: "Loading quiz history...",
    backToAllQuizzes: "← Back to All Quizzes",
    allAttempts: "All Attempts",
    certificate: "🏆 Certificate",
    pdfExport: "📄 PDF",
    loadingHistory: "Loading history...",
    noAttemptsFound: "No attempts found for this quiz.",
    attemptNumber: "Attempt #",
    points: "points",
    timeTakenLabel: "Time Taken:",
    achievementsEarned: "achievement(s) earned",
    quizHistory: "📚 Quiz History",
    trackProgressText: "Track your progress and improvement across all quizzes",
    exportToCSV: "📊 Export to CSV",
    noQuizHistoryYet: "No Quiz History Yet",
    completeQuizzesMessage: "Complete some quizzes to see your progress history here!",
    failedToLoadQuizzesHistory: "Failed to load quizzes",
    retry: "Retry",
    minutesLabel: "minutes",
    startButton: "START",
    history: "History",
    latestScore: "Latest Score:",
    completed: "Completed:",
    viewAllAttempts: "View All Attempts →",

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

    // Online Scams Page
    protectYourselfOnline: "Protect Yourself from Online Scams",
    onlineScamsIntro: "Online scams are some of the most common ways fraudsters trick people into giving up money, personal information, or account access. Learn how to recognize, avoid, and protect yourself against these threats.",
    phishingWebsites: "Phishing Websites",
    phishingWebsitesDesc: "Fake websites often mimic real companies like banks, shopping sites, or government portals. They usually try to get you to log in or enter payment information.",
    phishingTip1: "Look for misspelled URLs or odd domain names.",
    phishingTip2: "Check for HTTPS and a padlock in the browser bar.",
    phishingTip3: "Never enter sensitive info on a site you arrived at through an email or text link.",
    example: "Example:",
    phishingExample: 'A scammer creates a fake "PayPal" site like paypa1-security.com and asks you to log in.',
    onlineShoppingScams: "Online Shopping Scams",
    shoppingScamsDesc: "Fraudulent sellers set up fake e-commerce stores offering popular products at prices that are too good to be true. Victims may never receive their order, or receive counterfeit goods.",
    shoppingTip1: 'Be wary of deals that look "too good to be true."',
    shoppingTip2: "Research the seller — look for reviews and a real business address.",
    shoppingTip3: "Use secure payment methods like credit cards, not wire transfer.",
    shoppingExample: 'An Instagram ad promotes "50% off iPhones" from an unknown website, but your money disappears after checkout.',
    techSupportScams: "Tech Support Scams",
    techSupportScamsDesc: "Scammers may create fake pop-ups claiming your computer is infected with a virus, urging you to call a fake \"support line.\" They then try to gain access to your computer or charge fees for fake repairs.",
    techTip1: "Ignore urgent pop-ups demanding you call a number.",
    techTip2: "Real companies like Microsoft or Apple do not send unsolicited warnings.",
    techTip3: "Do not give strangers remote access to your computer.",
    techExample: 'A browser pop-up says "Your computer is infected! Call Microsoft support now: 1-800-XXX-XXXX."',
    socialMediaScams: "Social Media Scams",
    socialMediaScamsDesc: "Scammers use social platforms to spread fake giveaways, investment schemes, or impersonate friends/family asking for money.",
    socialTip1: "Verify requests for money — even if they come from a friend's account.",
    socialTip2: "Be cautious of links shared in DMs or group chats.",
    socialTip3: "Report and block fake accounts immediately.",
    socialExample: 'You get a message from a "friend" asking for emergency money, but their account was hacked.',
    staySafeOnline: "Stay Safe Online",
    bestDefense: "The best defense against scams is awareness. Keep learning and share this knowledge with your friends and family.",
    takeQuickQuiz: "Take a Quick Quiz",

    // Call Scams Page
    protectYourselfFromCalls: "Protect Yourself from Call Scams",
    callScamsIntro: "Call scams are a common method for fraudsters to trick people into giving up money, personal information, or account access. Learn how to recognize suspicious calls and protect yourself.",
    impersonationScams: "Impersonation Scams",
    impersonationDesc: "Scammers may pretend to be government officials, banks, or tech support representatives to get sensitive information.",
    impersonationTip1: "Never give personal info over the phone unless you initiated the call.",
    impersonationTip2: "Verify the caller's identity through official channels.",
    impersonationTip3: "Hang up if the caller pressures you for money or personal info.",
    impersonationExample: "A caller claims to be from the CRA demanding immediate payment for taxes.",
    techSupportCallScams: "Tech Support Scams",
    techSupportCallDesc: "Scammers pretend your computer is infected and try to get you to pay for fake repairs or give remote access.",
    techSupportCallTip1: "Ignore unsolicited tech support calls.",
    techSupportCallTip2: "Never grant remote access unless verified.",
    techSupportCallTip3: "Do not pay for unnecessary services.",
    techSupportCallExample: "A pop-up instructs you to call \"Microsoft support\" at a number you didn't look up yourself.",
    prizeLotteryScams: "Prize and Lottery Scams",
    prizeLotteryDesc: "Scammers claim you won a prize or lottery but must pay fees or taxes upfront.",
    prizeLotteryTip1: "Be skeptical of unexpected calls claiming you won something.",
    prizeLotteryTip2: "Legitimate prizes don't require advance payment.",
    prizeLotteryTip3: "Do not share banking info or personal documents.",
    prizeLotteryExample: "You get a call saying you won a $5,000 lottery and must wire a fee to claim it.",
    threateningScams: "Threatening Scams",
    threateningDesc: "Scammers use fear tactics, claiming legal trouble or arrest if you don't pay immediately.",
    threateningTip1: "Stay calm and do not respond to threats.",
    threateningTip2: "Verify claims through official sources.",
    threateningTip3: "Report threatening calls to authorities.",
    threateningExample: "A caller claims you will be arrested for unpaid fines unless you send money immediately.",
    staySafeFromCalls: "Stay Safe from Call Scams",
    callScamsAwareness: "Awareness is the best defense. Learn the signs, stay cautious, and educate friends and family.",

    // Email Scams Page
    protectYourselfFromEmails: "Protect Yourself from Email Scams",
    emailScamsIntro: "Email scams, often called phishing, trick people into sharing sensitive information, clicking malicious links, or downloading harmful attachments. Learn how to spot and avoid these threats.",
    phishingEmails: "Phishing Emails",
    phishingEmailsDesc: "Fraudsters send emails pretending to be banks, companies, or government agencies to steal your login info or money.",
    phishingEmailTip1: "Check sender addresses carefully for misspellings or strange domains.",
    phishingEmailTip2: "Do not click links or download attachments from unknown sources.",
    phishingEmailTip3: "Verify requests for sensitive info through official channels.",
    phishingEmailExample: "An email pretending to be from your bank asks you to log in via a link to \"verify your account.\"",
    fakeInvoiceScams: "Fake Invoice Scams",
    fakeInvoiceDesc: "Scammers send invoices for products or services you didn't order to trick you into paying.",
    fakeInvoiceTip1: "Double-check invoices with the actual company.",
    fakeInvoiceTip2: "Do not make payments to unknown vendors.",
    fakeInvoiceTip3: "Report suspicious invoices to your finance or IT department.",
    fakeInvoiceExample: "You receive a PDF invoice for software you never purchased, asking for immediate payment.",
    malwareAttachments: "Malware Attachments",
    malwareAttachmentsDesc: "Emails may include attachments containing viruses, ransomware, or spyware.",
    malwareTip1: "Never open attachments from unknown or unexpected emails.",
    malwareTip2: "Scan attachments with antivirus software before opening.",
    malwareTip3: "Keep your software and operating system up to date.",
    malwareExample: "A seemingly legitimate email includes a \"receipt\" PDF that installs ransomware when opened.",
    impersonationEmails: "Impersonation Emails",
    impersonationEmailsDesc: "Scammers impersonate colleagues, friends, or executives to trick you into sending money or sensitive info.",
    impersonationEmailTip1: "Verify unexpected requests directly with the person.",
    impersonationEmailTip2: "Be cautious of urgency or secrecy in emails.",
    impersonationEmailTip3: "Report impersonation attempts to IT or management.",
    impersonationEmailExample: "An email from \"your CEO\" asks you to wire money immediately for a confidential project.",
    staySafeFromEmails: "Stay Safe from Email Scams",
    emailScamsAwareness: "Awareness is the best defense. Learn to spot suspicious emails, avoid risky links, and educate friends and colleagues.",

    // Why It Matters Page
    whyItMatters: "Why It Matters?",
    whyItMattersDesc: "Scams are getting smarter — and more personal. From fake voices of loved ones to official-looking emails, fraudsters are finding new ways to trick people every day.",
    whyShouldYouCare: "Why Should You Care?",
    whyShouldYouCareDesc: "Because it can happen to anyone — especially our parents, grandparents, or even you. Losing money is just one part. It's the stress, the trust broken, and the helplessness that stays longer.",

    // Types of Scams Page
    typesOfScamsTitle: "TYPES OF SCAMS",
    emailScamsShort: "EMAIL SCAMS",
    emailScamsShortDesc: "Fraudsters Disguise As Trusted Sources — One Click And Your Data's Gone.",
    callScamsShort: "CALL SCAMS",
    callScamsShortDesc: "Scammers Use Fake Identities To Trick, Scare, Or Emotionally Manipulate You.",
    onlineScamsShort: "ONLINE SCAMS",
    onlineScamsShortDesc: "From Fake Websites To Too-Good-To-Be-True Offers — The Internet Is Their Playground.",

    // Footer
    allRightsReserved: "All rights reserved",

    // Admin Dashboard
    dashboard: "Dashboard",
    quizAnalytics: "Quiz Analytics",
    feedback: "Feedback",
    users: "Users",
    settings: "Settings",
    welcomeBackAdmin: "Welcome back",
    totalAttempts: "Total Attempts",
    daysStreak: "12 Days",
    completionRate: "Completion Rate",
    latestFeedback: "Latest Feedback",
    seeAll: "See all",
    noFeedbackYet: "No feedback yet",
    recentAttempts: "Recent Attempts",
    quiz: "Quiz",
    status: "Status",
    date: "Date",
    completedStatus: "Completed",
    noQuizAttemptsYet: "No quiz attempts yet",
    totalUsers: "Total Users",
    topQuiz: "Top Quiz",
    quickActions: "Quick Actions",
    takeQuiz: "Take Quiz",
    viewAnalytics: "View Analytics",
    viewFeedback: "View Feedback",
    signOut: "Sign Out",
    search: "Search",

    // Admin Users
    userManagement: "User Management",
    manageUsersRoles: "Manage users, roles, and permissions",
    searchUsers: "Search Users",
    searchByEmailOrName: "Search by email or name...",
    filterByRole: "Filter by Role",
    allRoles: "All Roles",
    adminRole: "Admin",
    userRole: "User",
    guestRole: "Guest",
    addUser: "Add User",
    loadingUsers: "Loading users...",
    noUsersFound: "No users found",
    roleHeader: "Role",
    statsHeader: "Stats",
    joinedHeader: "Joined",
    actionsHeader: "Actions",
    notApplicable: "N/A",
    quizzesLowercase: "quizzes",
    badgesLowercase: "badges",
    deleteAction: "Delete",
    showingUsers: "Showing {0} user{1}",
    addNewUser: "Add New User",
    emailRequired: "Email *",
    emailPlaceholder: "user@example.com",
    passwordRequired: "Password *",
    minimumCharacters: "Minimum 6 characters",
    displayNameLabel: "Display Name",
    displayNamePlaceholder: "John Doe",
    roleRequired: "Role *",
    cancelButton: "Cancel",
    createUserButton: "Create User",
    deleteUserTitle: "Delete User",
    deleteUserConfirm: "Are you sure you want to delete {0}? This action cannot be undone and will delete all user data including quiz progress, video progress, and badges.",
    deleteButton: "Delete",
    userCreatedSuccess: "User created successfully",
    failedToCreateUser: "Failed to create user",
    roleUpdatedSuccess: "Role updated successfully",
    failedToUpdateRole: "Failed to update role",
    userDeletedSuccess: "User deleted successfully",
    failedToDeleteUser: "Failed to delete user",
    failedToLoadUsers: "Failed to load users",
    pleaseLogInAccess: "Please log in to access this page",

    // Admin Questions
    questionManagement: "Question Management",
    addEditManageQuestions: "Add, edit, and manage quiz questions",
    selectQuiz: "Select Quiz",
    addQuestion: "Add Question",
    loadingQuestions: "Loading questions...",
    noQuestionsFound: "No questions found for this quiz",
    addFirstQuestion: "Add First Question",
    pointSingular: "point",
    pointsPlural: "points",
    questionCount: "{0} question{1} in {2}",
    addNewQuestion: "Add New Question",
    editQuestion: "Edit Question",
    questionTextRequired: "Question Text *",
    questionPlaceholder: "Enter your question here...",
    answerOptionsRequired: "Answer Options *",
    optionPlaceholder: "Option {0}",
    correctAnswerRequired: "Correct Answer *",
    pointsRequired: "Points *",
    questionOrderRequired: "Question Order *",
    questionOrderHint: "Order in which this question appears in the quiz",
    addQuestionButton: "Add Question",
    saveChangesButton: "Save Changes",
    questionAddedSuccess: "Question added successfully",
    questionUpdatedSuccess: "Question updated successfully",
    failedToSaveQuestion: "Failed to save question",
    deleteQuestionConfirm: "Are you sure you want to delete this question?",
    questionDeletedSuccess: "Question deleted successfully",
    failedToDeleteQuestion: "Failed to delete question",
    failedToLoadQuizzes: "Failed to load quizzes",
    failedToLoadQuestions: "Failed to load questions",

    // Admin Quiz Stats
    quizAnalyticsTitle: "📊 Quiz Analytics",
    comprehensiveStatistics: "Comprehensive statistics and insights for all quizzes",
    selectQuizStats: "Select Quiz",
    selectAQuiz: "Select a Quiz",
    chooseQuizSidebar: "Choose a quiz from the sidebar to view detailed analytics",
    loadingStatistics: "Loading statistics...",
    exportCSV: "📊 Export CSV",
    exportPDF: "📄 Export PDF",
    totalAttemptsMetric: "Total Attempts",
    uniqueUsersMetric: "Unique Users",
    avgScoreMetric: "Avg Score",
    passRateMetric: "Pass Rate",
    performanceMetrics: "Performance Metrics",
    highestScoreLabel: "Highest Score",
    lowestScoreLabel: "Lowest Score",
    averageScoreLabel: "Average Score",
    fastestTimeLabel: "Fastest Time",
    slowestTimeLabel: "Slowest Time",
    averageTimeLabel: "Average Time",
    engagementStatistics: "Engagement Statistics",
    retryRateLabel: "Retry Rate",
    usersWhoRetried: "Users Who Retried",
    avgAttemptsPerUser: "Avg Attempts/User",
    averageImprovement: "+{0}% Average Improvement",
    usersImproveRetrying: "Users improve on average when retrying",
    scoreDistributionTitle: "Score Distribution",
    noDistributionData: "No distribution data available",
    recentAttemptsTitle: "Recent Attempts",
    unknownUser: "Unknown User",
    attemptNumberLabel: "Attempt #{0}",
    noRecentAttempts: "No recent attempts",
    loadingQuizStatistics: "Loading quiz statistics...",

    // User Profile
    pleaseSignInProfile: "Please sign in to access your profile",
    signInButton: "Sign In",
    profileTab: "Profile",
    quizReferencesTab: "Quiz References",
    notificationsTab: "Notifications",
    searchPlaceholder: "Search",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    emailAddressLabel: "Email Address",
    emailCannotChange: "Email cannot be changed",
    passwordLabel: "Password",
    changeButton: "Change",
    changePasswordTitle: "Change Password",
    currentPasswordLabel: "Current Password",
    currentPasswordPlaceholder: "Enter current password",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "Enter new password",
    confirmNewPasswordLabel: "Confirm New Password",
    confirmNewPasswordPlaceholder: "Confirm new password",
    updatePasswordButton: "Update Password",
    savingButton: "Saving...",
    editProfileButton: "Edit Profile",
    saveChangesProfile: "Save Changes",
    accountRoleLabel: "Account Role:",
    yourBadgesTitle: "Your Badges",
    loadingBadges: "Loading badges...",
    noBadgesEarned: "No badges earned yet",
    completeBadgesMessage: "Complete quizzes and watch videos to earn badges!",
    earnedDateLabel: "Earned {0}",
    dangerZoneTitle: "Danger Zone",
    dangerZoneWarning: "Once you delete your account, there is no going back. Please be certain.",
    deleteAccountButton: "Delete Account",
    shuffleQuestionsLabel: "Shuffle Questions",
    shuffleAnswersLabel: "Shuffle Answers",
    showCorrectAnswersLabel: "Show Correct Answers After submission",
    allowRetryLabel: "Allow Retry",
    autoSaveProgressLabel: "Auto-Save Progress",
    resetQuizProgressTitle: "Reset Quiz Progress",
    resetQuizProgressDesc: "This will delete all your completed quizzes, allowing you to retake them. Your badges will remain unchanged.",
    resetAllQuizProgress: "Reset All Quiz Progress",
    emailNotificationsLabel: "Email Notifications",
    inWebNotificationsLabel: "In-Web Notifications",
    weeklySummaryLabel: "Weekly Summary",
    quizAlertsLabel: "Quiz Alerts",
    backToHome: "← Back to Home",
    updateProfilePhotoTitle: "Update Profile Photo",
    updatePhotoDesc: "Enter the URL of your profile photo. You can use images from services like Gravatar, or upload to image hosting services.",
    photoURLLabel: "Photo URL",
    photoURLPlaceholder: "https://example.com/photo.jpg",
    previewLabel: "Preview:",
    updatePhotoButton: "Update Photo",
    deleteAccountTitle: "Delete Account",
    deleteAccountConfirm: "Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete:",
    allQuizProgress: "All quiz progress and scores",
    allEarnedBadges: "All earned badges",
    allVideoProgress: "All video progress",
    accountPersonalData: "Your account and personal data",
    deletePermanentlyButton: "Delete Permanently",
    deletingButton: "Deleting...",
    resetQuizProgressQuestion: "Reset Quiz Progress?",
    resetProgressConfirm: "Are you sure you want to reset all your quiz progress? This will:",
    deleteCompletedRecords: "Delete all completed quiz records",
    allowRetakeQuizzes: "Allow you to retake all quizzes",
    keepEarnedBadges: "Keep your earned badges",
    resetProgressButton: "Reset Progress",
    resettingButton: "Resetting...",

    // Success Messages
    accountDeletedSuccessfully: "Account deleted successfully",
    passwordChangedSuccessfully: "Password changed successfully!",
    photoUpdatedSuccessfully: "Photo updated successfully!",
    profileUpdatedSuccessfully: "Profile updated successfully!",
    quizProgressResetSuccess: "Quiz progress reset successfully!",

    // Error Messages - Profile & Forms
    failedToChangePassword: "Failed to change password. Please try again.",
    failedToDeleteAccount: "Failed to delete account. Please try again.",
    failedToResetQuiz: "Failed to reset quiz progress. Please try again.",
    failedToSaveChanges: "Failed to save changes. Please try again.",
    failedToSubmitQuiz: "Failed to submit quiz. Please try again.",
    failedToUpdatePhoto: "Failed to update photo. Please try again.",
    passwordsDoNotMatch: "New passwords do not match!",
    passwordMinLength: "Password must be at least 6 characters long",
    pleaseEnterPhotoUrl: "Please enter a photo URL",
    pleaseSignInSubmitQuiz: "Please sign in to submit your quiz answers.",
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
    structuredPath: "Suivez un parcours structuré, étape par étape, pour maîtriser la détection des arnaques. Chaque module s'appuie sur le précédent, déverrouillant de nouveaux contenus au fur et à mesure de votre progression.",
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

    // Lessons - Email Module
    whatIsPhishing: "Qu'est-ce que le phishing?",
    phishingDesc: "Le phishing est un type d'arnaque en ligne où les attaquants se font passer pour des organisations légitimes afin de voler vos informations personnelles, mots de passe ou détails financiers.",
    spottingFakeEmails: "Repérer les faux emails",
    spottingDesc: "Apprenez à identifier les signaux d'alarme: adresses d'expéditeur suspectes, langage urgent, fautes d'orthographe, salutations génériques et demandes d'informations sensibles.",
    protectingYourself: "Vous protéger",
    protectingDesc: "Meilleures pratiques: vérifier l'identité de l'expéditeur, ne pas cliquer sur les liens suspects, utiliser des filtres anti-spam, activer l'authentification à deux facteurs et signaler les tentatives de phishing.",

    // Lessons - Call Module
    phoneTactics: "Tactiques courantes d'arnaque téléphonique",
    phoneTacticsDesc: "Les arnaqueurs utilisent l'urgence, les menaces et l'usurpation d'identité pour manipuler les victimes. Ils peuvent prétendre être de l'administration fiscale, du support technique ou des banques.",
    techSupportExposed: "Arnaques au support technique démasquées",
    techSupportDesc: "Les faux appels de support technique prétendent que votre ordinateur a un virus et demandent un accès à distance. Les entreprises légitimes n'appellent jamais de manière non sollicitée.",
    respondSafely: "Comment répondre en toute sécurité",
    respondDesc: "Raccrochez immédiatement, vérifiez l'identité de l'appelant de manière indépendante, ne partagez jamais d'informations personnelles et signalez les appels suspects aux autorités.",

    // Lessons - Online Module
    identifyFakeWebsites: "Identifier les faux sites web",
    fakeWebsitesDesc: "Vérifiez le HTTPS, recherchez les sceaux de confiance, vérifiez l'orthographe du domaine, surveillez le design de mauvaise qualité et recherchez la légitimité de l'entreprise.",
    socialMediaPrevention: "Prévention des arnaques sur les réseaux sociaux",
    socialMediaDesc: "Méfiez-vous des offres trop belles pour être vraies, des fausses demandes d'amis, des liens de phishing, des arnaques sentimentales et des systèmes de cryptomonnaie.",
    safeOnlineShopping: "Achats en ligne sécurisés",
    safeShoppingDesc: "Utilisez des méthodes de paiement sécurisées, recherchez les vendeurs, vérifiez les avis, évitez les virements bancaires et méfiez-vous des offres trop belles pour être vraies.",

    // Free Learning
    exploreCategories: "Explorer les catégories d'arnaques",
    chooseScamType: "Choisissez un type d'arnaque pour explorer sa bibliothèque d'apprentissage.",
    emailScamsTitle: "Arnaques par email",
    spotPhishingEmails: "Repérer les emails de phishing et les fausses pièces jointes.",
    callScamsTitle: "Arnaques téléphoniques",
    detectFakeTech: "Détecter le faux support technique et les appels suspects.",
    onlineScamsTitle: "Arnaques en ligne",
    identifyFakeWebsitesShort: "Identifier les faux sites web, liens de phishing et offres frauduleuses.",

    // Libraries
    learningLibraries: "Bibliothèques d'apprentissage",
    recognizePhishing: "Reconnaître les emails de phishing",
    recognizePhishingDesc: "Apprenez les signaux d'alarme et les exemples réels de tentatives de phishing.",
    avoidAttachments: "Éviter les pièces jointes malveillantes",
    avoidAttachmentsDesc: "Comprendre les dangers des pièces jointes non sécurisées et des fausses factures.",
    identifySpoofed: "Identifier les expéditeurs usurpés",
    identifySpoofedDesc: "Repérer les fausses adresses 'from' et les tentatives d'usurpation d'identité.",

    phoneScripts: "Scripts courants d'arnaques téléphoniques",
    phoneScriptsDesc: "Examinez des enregistrements réels d'appels frauduleux et comment y répondre en toute sécurité.",
    techAwareness: "Sensibilisation aux arnaques au support technique",
    techAwarenessDesc: "Apprenez comment les faux appels de support technique trompent les victimes pour révéler des informations.",
    protectSeniors: "Protéger les seniors des arnaques téléphoniques",
    protectSeniorsDesc: "Conseils et guides pour aider les personnes âgées à reconnaître la fraude téléphonique.",

    safeShopping: "Achats en ligne sécurisés",
    safeShoppingLibDesc: "Comment identifier les sites de commerce électronique sûrs vs frauduleux.",
    socialMediaScamsPrevention: "Prévention des arnaques sur les réseaux sociaux",
    socialMediaDesc2: "Éviter les arnaques et les faux liens sur les principales plateformes.",
    fakeJobOffers: "Reconnaître les fausses offres d'emploi",
    fakeJobOffersDesc: "Détecter les arnaques à l'emploi et les recruteurs frauduleux.",

    // Courses
    courses: "Cours",
    emailSecurityBasics: "Bases de la sécurité email",
    emailSecurityDesc: "Repérer les emails de phishing, les liens malveillants et les fausses pièces jointes.",
    callScamSafety: "Bases de la sécurité des appels",
    callScamSafetyDesc: "Repérer le faux support technique et les appels téléphoniques suspects.",
    onlineScamDetection: "Détection des arnaques en ligne",
    onlineScamDetectionDesc: "Apprenez à repérer les faux sites web et les offres frauduleuses.",
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
    retryQuiz: "Réessayer le quiz",
    exitQuiz: "Quitter le quiz",
    exitReview: "Quitter la révision",
    submitQuiz: "Soumettre le quiz",
    quizResults: "Résultats du quiz",
    score: "Score",
    percentage: "Pourcentage",
    timeTaken: "Temps écoulé",
    timeLeft: "Temps restant",
    question: "Question",
    of: "sur",
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
    noQuizzesMatch: "Aucun quiz ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres.",
    noNewQuizzes: "Aucun nouveau quiz disponible pour le moment.",
    noCompletedQuizzes: "Vous n'avez pas encore terminé de quiz.",
    noCompletedMatch: "Aucun quiz complété ne correspond à vos critères de recherche.",
    completedBadge: "✔ Complété",
    newBadge: "✨ Nouveau",
    previous: "Précédent",
    next: "Suivant",

    // Quiz Results Messages
    outstandingPerformance: "🎊 Performance exceptionnelle! 🎊",
    greatJob: "🌟 Excellent travail! 🌟",
    wellDone: "✅ Bien joué! ✅",
    keepPracticing: "💪 Continuez à pratiquer! 💪",
    youCrushedIt: "Vous avez tout déchiré!",
    youDidWell: "Vous avez très bien fait!",
    youPassed: "Vous avez réussi le quiz!",
    everyAttempt: "Chaque tentative vous rend plus fort!",
    excellentMaster: "Excellent - Vous êtes un maître des quiz!",
    goodKnowStuff: "Bien - Vous connaissez vraiment votre sujet!",
    passKeepGoing: "Réussi - Continuez comme ça!",
    tryAgainPractice: "Réessayez - La pratique rend parfait!",
    newBadgesEarned: "Nouveaux badges obtenus!",
    congratsAchievement: "Félicitations pour votre réalisation!",
    answerReview: "Révision des réponses",
    seeHowYouDid: "Voyez comment vous avez réussi chaque question",
    totalScore: "Score total",
    accuracy: "Précision",
    hurry: "⚠️ Dépêchez-vous!",
    questionNotAvailable: "Question non disponible",
    optionsNotAvailable: "Les options de la question ne sont pas disponibles. Veuillez rafraîchir la page.",
    loadingQuiz: "Chargement du quiz...",
    pleaseWait: "Veuillez patienter pendant que nous chargeons les questions du quiz.",
    submitting: "Envoi en cours...",

    // Quiz Results & History
    questionOf: "Question {0} sur {1}",
    yourScore: "Votre score",
    correctAnswerExclaim: "Bonne réponse!",
    incorrectAnswer: "Mauvaise réponse",
    explanation: "Explication",
    loading: "Chargement...",
    error: "Erreur",
    questionDataNotFound: "Données de la question introuvables.",
    loadingQuizResults: "Chargement des résultats du quiz...",
    signInRequired: "Connexion requise",
    pleaseSignInToView: "Veuillez vous connecter pour voir votre historique de quiz.",
    loadingQuizHistory: "Chargement de l'historique des quiz...",
    backToAllQuizzes: "← Retour à tous les quiz",
    allAttempts: "Toutes les tentatives",
    certificate: "🏆 Certificat",
    pdfExport: "📄 PDF",
    loadingHistory: "Chargement de l'historique...",
    noAttemptsFound: "Aucune tentative trouvée pour ce quiz.",
    attemptNumber: "Tentative #",
    points: "points",
    timeTakenLabel: "Temps écoulé:",
    achievementsEarned: "réalisation(s) obtenue(s)",
    quizHistory: "📚 Historique des quiz",
    trackProgressText: "Suivez vos progrès et votre amélioration dans tous les quiz",
    exportToCSV: "📊 Exporter en CSV",
    noQuizHistoryYet: "Pas encore d'historique de quiz",
    completeQuizzesMessage: "Complétez des quiz pour voir votre historique de progression ici!",
    failedToLoadQuizzesHistory: "Échec du chargement des quiz",
    retry: "Réessayer",
    minutesLabel: "minutes",
    startButton: "COMMENCER",
    history: "Historique",
    latestScore: "Dernier score:",
    completed: "Complété:",
    viewAllAttempts: "Voir toutes les tentatives →",

    // Authentication
    everyClickMatters: "Chaque clic compte.",
    learnClickSmart: "Apprenez à cliquer intelligemment.",
    login: "Connexion",
    createAccount: "Créer un compte",
    welcomeBack: "Bon retour!",
    signInToContinue: "Se connecter pour continuer",
    enterEmail: "Entrez votre adresse email",
    enterPassword: "Entrez votre mot de passe",
    enterFullName: "Entrez votre nom complet",
    forgotPassword: "Mot de passe oublié?",
    signingIn: "Connexion en cours...",
    orContinueWith: "Ou continuez avec",
    iAgreeToTerms: "J'accepte les",
    termsAndConditions: "termes et conditions",
    creatingAccount: "Création du compte...",
    signUp: "S'inscrire",
    welcomeToGuardEd: "Bienvenue sur",
    signUpToContinue: "Inscrivez-vous pour continuer",

    // Error Messages
    userNotFoundDb: "Utilisateur introuvable dans la base de données. Veuillez contacter le support.",
    loginFailed: "La connexion a échoué. Veuillez réessayer.",
    googleSignInFailed: "La connexion Google a échoué. Veuillez réessayer.",
    facebookSignInFailed: "La connexion Facebook a échoué. Veuillez réessayer.",
    userNotFoundRegister: "Utilisateur introuvable dans la base de données. Veuillez vous inscrire d'abord.",
    agreeToTermsError: "Veuillez accepter les termes et conditions.",
    registrationFailed: "L'inscription a échoué. Veuillez réessayer.",

    // Online Scams Page
    protectYourselfOnline: "Protégez-vous contre les arnaques en ligne",
    onlineScamsIntro: "Les arnaques en ligne sont parmi les moyens les plus courants utilisés par les fraudeurs pour inciter les gens à donner de l'argent, des informations personnelles ou l'accès à leur compte. Apprenez à reconnaître, éviter et vous protéger contre ces menaces.",
    phishingWebsites: "Sites web de phishing",
    phishingWebsitesDesc: "Les faux sites web imitent souvent de vraies entreprises comme les banques, les sites de shopping ou les portails gouvernementaux. Ils essaient généralement de vous faire vous connecter ou entrer des informations de paiement.",
    phishingTip1: "Recherchez les URL mal orthographiées ou les noms de domaine étranges.",
    phishingTip2: "Vérifiez la présence de HTTPS et d'un cadenas dans la barre du navigateur.",
    phishingTip3: "Ne saisissez jamais d'informations sensibles sur un site auquel vous êtes arrivé via un email ou un lien texte.",
    example: "Exemple:",
    phishingExample: 'Un arnaqueur crée un faux site "PayPal" comme paypa1-security.com et vous demande de vous connecter.',
    onlineShoppingScams: "Arnaques aux achats en ligne",
    shoppingScamsDesc: "Les vendeurs frauduleux créent de faux magasins de commerce électronique offrant des produits populaires à des prix trop beaux pour être vrais. Les victimes peuvent ne jamais recevoir leur commande ou recevoir des produits contrefaits.",
    shoppingTip1: "Méfiez-vous des offres qui semblent \"trop belles pour être vraies\".",
    shoppingTip2: "Recherchez le vendeur — recherchez des avis et une vraie adresse commerciale.",
    shoppingTip3: "Utilisez des méthodes de paiement sécurisées comme les cartes de crédit, pas les virements bancaires.",
    shoppingExample: "Une publicité Instagram fait la promotion d'\"iPhones à 50% de réduction\" depuis un site inconnu, mais votre argent disparaît après le paiement.",
    techSupportScams: "Arnaques au support technique",
    techSupportScamsDesc: "Les arnaqueurs peuvent créer de faux pop-ups prétendant que votre ordinateur est infecté par un virus, vous incitant à appeler une fausse \"ligne d'assistance\". Ils essaient ensuite d'accéder à votre ordinateur ou de facturer des frais pour de fausses réparations.",
    techTip1: "Ignorez les pop-ups urgents vous demandant d'appeler un numéro.",
    techTip2: "Les vraies entreprises comme Microsoft ou Apple n'envoient pas d'avertissements non sollicités.",
    techTip3: "Ne donnez pas d'accès à distance à votre ordinateur à des inconnus.",
    techExample: "Un pop-up de navigateur dit \"Votre ordinateur est infecté! Appelez le support Microsoft maintenant: 1-800-XXX-XXXX.\"",
    socialMediaScams: "Arnaques sur les réseaux sociaux",
    socialMediaScamsDesc: "Les arnaqueurs utilisent les plateformes sociales pour diffuser de faux cadeaux, des systèmes d'investissement ou usurper l'identité d'amis/famille pour demander de l'argent.",
    socialTip1: "Vérifiez les demandes d'argent — même si elles proviennent du compte d'un ami.",
    socialTip2: "Soyez prudent avec les liens partagés dans les messages privés ou les discussions de groupe.",
    socialTip3: "Signalez et bloquez immédiatement les faux comptes.",
    socialExample: "Vous recevez un message d'un \"ami\" demandant de l'argent d'urgence, mais son compte a été piraté.",
    staySafeOnline: "Restez en sécurité en ligne",
    bestDefense: "La meilleure défense contre les arnaques est la sensibilisation. Continuez à apprendre et partagez ces connaissances avec vos amis et votre famille.",
    takeQuickQuiz: "Répondre à un quiz rapide",

    // Call Scams Page
    protectYourselfFromCalls: "Protégez-vous contre les arnaques téléphoniques",
    callScamsIntro: "Les arnaques téléphoniques sont une méthode courante utilisée par les fraudeurs pour inciter les gens à donner de l'argent, des informations personnelles ou l'accès à leur compte. Apprenez à reconnaître les appels suspects et à vous protéger.",
    impersonationScams: "Arnaques par usurpation d'identité",
    impersonationDesc: "Les arnaqueurs peuvent prétendre être des fonctionnaires, des banques ou des représentants du support technique pour obtenir des informations sensibles.",
    impersonationTip1: "Ne donnez jamais d'informations personnelles par téléphone à moins d'avoir initié l'appel.",
    impersonationTip2: "Vérifiez l'identité de l'appelant par les canaux officiels.",
    impersonationTip3: "Raccrochez si l'appelant fait pression pour obtenir de l'argent ou des informations personnelles.",
    impersonationExample: "Un appelant prétend être de l'ARC et exige un paiement immédiat pour les impôts.",
    techSupportCallScams: "Arnaques au support technique",
    techSupportCallDesc: "Les arnaqueurs prétendent que votre ordinateur est infecté et essaient de vous faire payer pour de fausses réparations ou d'obtenir un accès à distance.",
    techSupportCallTip1: "Ignorez les appels de support technique non sollicités.",
    techSupportCallTip2: "N'accordez jamais d'accès à distance sans vérification.",
    techSupportCallTip3: "Ne payez pas pour des services inutiles.",
    techSupportCallExample: "Un pop-up vous demande d'appeler le \"support Microsoft\" à un numéro que vous n'avez pas recherché vous-même.",
    prizeLotteryScams: "Arnaques aux prix et loteries",
    prizeLotteryDesc: "Les arnaqueurs prétendent que vous avez gagné un prix ou une loterie mais devez payer des frais ou des taxes à l'avance.",
    prizeLotteryTip1: "Soyez sceptique face aux appels inattendus prétendant que vous avez gagné quelque chose.",
    prizeLotteryTip2: "Les prix légitimes n'exigent pas de paiement anticipé.",
    prizeLotteryTip3: "Ne partagez pas d'informations bancaires ou de documents personnels.",
    prizeLotteryExample: "Vous recevez un appel disant que vous avez gagné une loterie de 5 000 $ et devez virer des frais pour la réclamer.",
    threateningScams: "Arnaques par menaces",
    threateningDesc: "Les arnaqueurs utilisent des tactiques de peur, prétendant des problèmes juridiques ou une arrestation si vous ne payez pas immédiatement.",
    threateningTip1: "Restez calme et ne répondez pas aux menaces.",
    threateningTip2: "Vérifiez les affirmations par des sources officielles.",
    threateningTip3: "Signalez les appels menaçants aux autorités.",
    threateningExample: "Un appelant prétend que vous serez arrêté pour amendes impayées à moins d'envoyer de l'argent immédiatement.",
    staySafeFromCalls: "Restez en sécurité contre les arnaques téléphoniques",
    callScamsAwareness: "La sensibilisation est la meilleure défense. Apprenez les signes, restez prudent et éduquez vos amis et votre famille.",

    // Email Scams Page
    protectYourselfFromEmails: "Protégez-vous contre les arnaques par courriel",
    emailScamsIntro: "Les arnaques par courriel, souvent appelées phishing, incitent les gens à partager des informations sensibles, cliquer sur des liens malveillants ou télécharger des pièces jointes nuisibles. Apprenez à repérer et éviter ces menaces.",
    phishingEmails: "Courriels de phishing",
    phishingEmailsDesc: "Les fraudeurs envoient des courriels en se faisant passer pour des banques, des entreprises ou des agences gouvernementales pour voler vos informations de connexion ou votre argent.",
    phishingEmailTip1: "Vérifiez attentivement les adresses des expéditeurs pour détecter les fautes d'orthographe ou les domaines étranges.",
    phishingEmailTip2: "Ne cliquez pas sur les liens et ne téléchargez pas de pièces jointes provenant de sources inconnues.",
    phishingEmailTip3: "Vérifiez les demandes d'informations sensibles par les canaux officiels.",
    phishingEmailExample: "Un courriel prétendant provenir de votre banque vous demande de vous connecter via un lien pour \"vérifier votre compte\".",
    fakeInvoiceScams: "Arnaques aux fausses factures",
    fakeInvoiceDesc: "Les arnaqueurs envoient des factures pour des produits ou services que vous n'avez pas commandés pour vous inciter à payer.",
    fakeInvoiceTip1: "Vérifiez les factures auprès de l'entreprise réelle.",
    fakeInvoiceTip2: "Ne faites pas de paiements à des fournisseurs inconnus.",
    fakeInvoiceTip3: "Signalez les factures suspectes à votre département financier ou informatique.",
    fakeInvoiceExample: "Vous recevez une facture PDF pour un logiciel que vous n'avez jamais acheté, demandant un paiement immédiat.",
    malwareAttachments: "Pièces jointes malveillantes",
    malwareAttachmentsDesc: "Les courriels peuvent inclure des pièces jointes contenant des virus, des rançongiciels ou des logiciels espions.",
    malwareTip1: "N'ouvrez jamais de pièces jointes provenant de courriels inconnus ou inattendus.",
    malwareTip2: "Analysez les pièces jointes avec un logiciel antivirus avant de les ouvrir.",
    malwareTip3: "Maintenez votre logiciel et système d'exploitation à jour.",
    malwareExample: "Un courriel apparemment légitime inclut un PDF de \"reçu\" qui installe un rançongiciel lors de l'ouverture.",
    impersonationEmails: "Courriels d'usurpation d'identité",
    impersonationEmailsDesc: "Les arnaqueurs usurpent l'identité de collègues, d'amis ou de dirigeants pour vous inciter à envoyer de l'argent ou des informations sensibles.",
    impersonationEmailTip1: "Vérifiez les demandes inattendues directement avec la personne.",
    impersonationEmailTip2: "Soyez prudent face à l'urgence ou au secret dans les courriels.",
    impersonationEmailTip3: "Signalez les tentatives d'usurpation d'identité à l'informatique ou à la direction.",
    impersonationEmailExample: "Un courriel de \"votre PDG\" vous demande de virer de l'argent immédiatement pour un projet confidentiel.",
    staySafeFromEmails: "Restez en sécurité contre les arnaques par courriel",
    emailScamsAwareness: "La sensibilisation est la meilleure défense. Apprenez à repérer les courriels suspects, évitez les liens risqués et éduquez vos amis et collègues.",

    // Why It Matters Page
    whyItMatters: "Pourquoi est-ce important?",
    whyItMattersDesc: "Les arnaques deviennent de plus en plus sophistiquées et personnelles. Des fausses voix d'êtres chers aux courriels d'apparence officielle, les fraudeurs trouvent chaque jour de nouveaux moyens de tromper les gens.",
    whyShouldYouCare: "Pourquoi devriez-vous vous en soucier?",
    whyShouldYouCareDesc: "Parce que cela peut arriver à n'importe qui — en particulier à nos parents, grands-parents, ou même à vous. Perdre de l'argent n'est qu'une partie du problème. C'est le stress, la confiance brisée et le sentiment d'impuissance qui restent plus longtemps.",

    // Types of Scams Page
    typesOfScamsTitle: "TYPES D'ARNAQUES",
    emailScamsShort: "ARNAQUES PAR COURRIEL",
    emailScamsShortDesc: "Les fraudeurs se déguisent en sources de confiance — Un clic et vos données disparaissent.",
    callScamsShort: "ARNAQUES TÉLÉPHONIQUES",
    callScamsShortDesc: "Les arnaqueurs utilisent de fausses identités pour tromper, effrayer ou manipuler émotionnellement.",
    onlineScamsShort: "ARNAQUES EN LIGNE",
    onlineScamsShortDesc: "Des faux sites web aux offres trop belles pour être vraies — Internet est leur terrain de jeu.",

    // Footer
    allRightsReserved: "Tous droits réservés",

    // Admin Dashboard
    dashboard: "Tableau de bord",
    quizAnalytics: "Analytique des quiz",
    feedback: "Commentaires",
    users: "Utilisateurs",
    settings: "Paramètres",
    welcomeBackAdmin: "Bon retour",
    totalAttempts: "Tentatives totales",
    daysStreak: "12 jours",
    completionRate: "Taux de réussite",
    latestFeedback: "Derniers commentaires",
    seeAll: "Voir tout",
    noFeedbackYet: "Aucun commentaire pour le moment",
    recentAttempts: "Tentatives récentes",
    quiz: "Quiz",
    status: "Statut",
    date: "Date",
    completedStatus: "Terminé",
    noQuizAttemptsYet: "Aucune tentative de quiz pour le moment",
    totalUsers: "Total d'utilisateurs",
    topQuiz: "Meilleur quiz",
    quickActions: "Actions rapides",
    takeQuiz: "Passer un quiz",
    viewAnalytics: "Voir l'analytique",
    viewFeedback: "Voir les commentaires",
    signOut: "Se déconnecter",
    search: "Rechercher",

    // Admin Users
    userManagement: "Gestion des utilisateurs",
    manageUsersRoles: "Gérer les utilisateurs, rôles et permissions",
    searchUsers: "Rechercher des utilisateurs",
    searchByEmailOrName: "Rechercher par courriel ou nom...",
    filterByRole: "Filtrer par rôle",
    allRoles: "Tous les rôles",
    adminRole: "Admin",
    userRole: "Utilisateur",
    guestRole: "Invité",
    addUser: "Ajouter un utilisateur",
    loadingUsers: "Chargement des utilisateurs...",
    noUsersFound: "Aucun utilisateur trouvé",
    roleHeader: "Rôle",
    statsHeader: "Statistiques",
    joinedHeader: "Inscrit",
    actionsHeader: "Actions",
    notApplicable: "N/A",
    quizzesLowercase: "quiz",
    badgesLowercase: "badges",
    deleteAction: "Supprimer",
    showingUsers: "Affichage de {0} utilisateur{1}",
    addNewUser: "Ajouter un nouvel utilisateur",
    emailRequired: "Courriel *",
    emailPlaceholder: "utilisateur@exemple.com",
    passwordRequired: "Mot de passe *",
    minimumCharacters: "Minimum 6 caractères",
    displayNameLabel: "Nom d'affichage",
    displayNamePlaceholder: "Jean Dupont",
    roleRequired: "Rôle *",
    cancelButton: "Annuler",
    createUserButton: "Créer un utilisateur",
    deleteUserTitle: "Supprimer l'utilisateur",
    deleteUserConfirm: "Êtes-vous sûr de vouloir supprimer {0} ? Cette action est irréversible et supprimera toutes les données utilisateur y compris la progression des quiz, la progression vidéo et les badges.",
    deleteButton: "Supprimer",
    userCreatedSuccess: "Utilisateur créé avec succès",
    failedToCreateUser: "Échec de la création de l'utilisateur",
    roleUpdatedSuccess: "Rôle mis à jour avec succès",
    failedToUpdateRole: "Échec de la mise à jour du rôle",
    userDeletedSuccess: "Utilisateur supprimé avec succès",
    failedToDeleteUser: "Échec de la suppression de l'utilisateur",
    failedToLoadUsers: "Échec du chargement des utilisateurs",
    pleaseLogInAccess: "Veuillez vous connecter pour accéder à cette page",

    // Admin Questions
    questionManagement: "Gestion des questions",
    addEditManageQuestions: "Ajouter, modifier et gérer les questions de quiz",
    selectQuiz: "Sélectionner un quiz",
    addQuestion: "Ajouter une question",
    loadingQuestions: "Chargement des questions...",
    noQuestionsFound: "Aucune question trouvée pour ce quiz",
    addFirstQuestion: "Ajouter la première question",
    pointSingular: "point",
    pointsPlural: "points",
    questionCount: "{0} question{1} dans {2}",
    addNewQuestion: "Ajouter une nouvelle question",
    editQuestion: "Modifier la question",
    questionTextRequired: "Texte de la question *",
    questionPlaceholder: "Entrez votre question ici...",
    answerOptionsRequired: "Options de réponse *",
    optionPlaceholder: "Option {0}",
    correctAnswerRequired: "Réponse correcte *",
    pointsRequired: "Points *",
    questionOrderRequired: "Ordre de la question *",
    questionOrderHint: "Ordre dans lequel cette question apparaît dans le quiz",
    addQuestionButton: "Ajouter une question",
    saveChangesButton: "Enregistrer les modifications",
    questionAddedSuccess: "Question ajoutée avec succès",
    questionUpdatedSuccess: "Question mise à jour avec succès",
    failedToSaveQuestion: "Échec de l'enregistrement de la question",
    deleteQuestionConfirm: "Êtes-vous sûr de vouloir supprimer cette question ?",
    questionDeletedSuccess: "Question supprimée avec succès",
    failedToDeleteQuestion: "Échec de la suppression de la question",
    failedToLoadQuizzes: "Échec du chargement des quiz",
    failedToLoadQuestions: "Échec du chargement des questions",

    // Admin Quiz Stats
    quizAnalyticsTitle: "📊 Analytique des quiz",
    comprehensiveStatistics: "Statistiques complètes et informations pour tous les quiz",
    selectQuizStats: "Sélectionner un quiz",
    selectAQuiz: "Sélectionner un quiz",
    chooseQuizSidebar: "Choisissez un quiz dans la barre latérale pour voir l'analytique détaillée",
    loadingStatistics: "Chargement des statistiques...",
    exportCSV: "📊 Exporter en CSV",
    exportPDF: "📄 Exporter en PDF",
    totalAttemptsMetric: "Tentatives totales",
    uniqueUsersMetric: "Utilisateurs uniques",
    avgScoreMetric: "Score moyen",
    passRateMetric: "Taux de réussite",
    performanceMetrics: "Métriques de performance",
    highestScoreLabel: "Score le plus élevé",
    lowestScoreLabel: "Score le plus bas",
    averageScoreLabel: "Score moyen",
    fastestTimeLabel: "Temps le plus rapide",
    slowestTimeLabel: "Temps le plus lent",
    averageTimeLabel: "Temps moyen",
    engagementStatistics: "Statistiques d'engagement",
    retryRateLabel: "Taux de nouvelle tentative",
    usersWhoRetried: "Utilisateurs ayant réessayé",
    avgAttemptsPerUser: "Tentatives moyennes/utilisateur",
    averageImprovement: "+{0}% Amélioration moyenne",
    usersImproveRetrying: "Les utilisateurs s'améliorent en moyenne en réessayant",
    scoreDistributionTitle: "Distribution des scores",
    noDistributionData: "Aucune donnée de distribution disponible",
    recentAttemptsTitle: "Tentatives récentes",
    unknownUser: "Utilisateur inconnu",
    attemptNumberLabel: "Tentative #{0}",
    noRecentAttempts: "Aucune tentative récente",
    loadingQuizStatistics: "Chargement des statistiques de quiz...",

    // User Profile
    pleaseSignInProfile: "Veuillez vous connecter pour accéder à votre profil",
    signInButton: "Se connecter",
    profileTab: "Profil",
    quizReferencesTab: "Références de quiz",
    notificationsTab: "Notifications",
    searchPlaceholder: "Rechercher",
    fullNameLabel: "Nom complet",
    fullNamePlaceholder: "Entrez votre nom complet",
    emailAddressLabel: "Adresse courriel",
    emailCannotChange: "Le courriel ne peut pas être modifié",
    passwordLabel: "Mot de passe",
    changeButton: "Modifier",
    changePasswordTitle: "Modifier le mot de passe",
    currentPasswordLabel: "Mot de passe actuel",
    currentPasswordPlaceholder: "Entrez le mot de passe actuel",
    newPasswordLabel: "Nouveau mot de passe",
    newPasswordPlaceholder: "Entrez le nouveau mot de passe",
    confirmNewPasswordLabel: "Confirmer le nouveau mot de passe",
    confirmNewPasswordPlaceholder: "Confirmez le nouveau mot de passe",
    updatePasswordButton: "Mettre à jour le mot de passe",
    savingButton: "Enregistrement...",
    editProfileButton: "Modifier le profil",
    saveChangesProfile: "Enregistrer les modifications",
    accountRoleLabel: "Rôle du compte :",
    yourBadgesTitle: "Vos badges",
    loadingBadges: "Chargement des badges...",
    noBadgesEarned: "Aucun badge obtenu pour le moment",
    completeBadgesMessage: "Complétez des quiz et regardez des vidéos pour obtenir des badges !",
    earnedDateLabel: "Obtenu le {0}",
    dangerZoneTitle: "Zone de danger",
    dangerZoneWarning: "Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. Veuillez être certain.",
    deleteAccountButton: "Supprimer le compte",
    shuffleQuestionsLabel: "Mélanger les questions",
    shuffleAnswersLabel: "Mélanger les réponses",
    showCorrectAnswersLabel: "Afficher les bonnes réponses après soumission",
    allowRetryLabel: "Autoriser les nouvelles tentatives",
    autoSaveProgressLabel: "Enregistrement automatique de la progression",
    resetQuizProgressTitle: "Réinitialiser la progression des quiz",
    resetQuizProgressDesc: "Cela supprimera tous vos quiz terminés, vous permettant de les repasser. Vos badges resteront inchangés.",
    resetAllQuizProgress: "Réinitialiser toute la progression des quiz",
    emailNotificationsLabel: "Notifications par courriel",
    inWebNotificationsLabel: "Notifications dans l'application",
    weeklySummaryLabel: "Résumé hebdomadaire",
    quizAlertsLabel: "Alertes de quiz",
    backToHome: "← Retour à l'accueil",
    updateProfilePhotoTitle: "Mettre à jour la photo de profil",
    updatePhotoDesc: "Entrez l'URL de votre photo de profil. Vous pouvez utiliser des images de services comme Gravatar, ou télécharger vers des services d'hébergement d'images.",
    photoURLLabel: "URL de la photo",
    photoURLPlaceholder: "https://exemple.com/photo.jpg",
    previewLabel: "Aperçu :",
    updatePhotoButton: "Mettre à jour la photo",
    deleteAccountTitle: "Supprimer le compte",
    deleteAccountConfirm: "Êtes-vous absolument sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera définitivement :",
    allQuizProgress: "Toute la progression et les scores des quiz",
    allEarnedBadges: "Tous les badges obtenus",
    allVideoProgress: "Toute la progression vidéo",
    accountPersonalData: "Votre compte et vos données personnelles",
    deletePermanentlyButton: "Supprimer définitivement",
    deletingButton: "Suppression...",
    resetQuizProgressQuestion: "Réinitialiser la progression des quiz ?",
    resetProgressConfirm: "Êtes-vous sûr de vouloir réinitialiser toute votre progression de quiz ? Cela va :",
    deleteCompletedRecords: "Supprimer tous les enregistrements de quiz terminés",
    allowRetakeQuizzes: "Vous permettre de repasser tous les quiz",
    keepEarnedBadges: "Conserver vos badges obtenus",
    resetProgressButton: "Réinitialiser la progression",
    resettingButton: "Réinitialisation...",

    // Success Messages
    accountDeletedSuccessfully: "Compte supprimé avec succès",
    passwordChangedSuccessfully: "Mot de passe modifié avec succès!",
    photoUpdatedSuccessfully: "Photo mise à jour avec succès!",
    profileUpdatedSuccessfully: "Profil mis à jour avec succès!",
    quizProgressResetSuccess: "Progression du quiz réinitialisée avec succès!",

    // Error Messages - Profile & Forms
    failedToChangePassword: "Échec du changement de mot de passe. Veuillez réessayer.",
    failedToDeleteAccount: "Échec de la suppression du compte. Veuillez réessayer.",
    failedToResetQuiz: "Échec de la réinitialisation de la progression du quiz. Veuillez réessayer.",
    failedToSaveChanges: "Échec de l'enregistrement des modifications. Veuillez réessayer.",
    failedToSubmitQuiz: "Échec de la soumission du quiz. Veuillez réessayer.",
    failedToUpdatePhoto: "Échec de la mise à jour de la photo. Veuillez réessayer.",
    passwordsDoNotMatch: "Les nouveaux mots de passe ne correspondent pas!",
    passwordMinLength: "Le mot de passe doit contenir au moins 6 caractères",
    pleaseEnterPhotoUrl: "Veuillez entrer une URL de photo",
    pleaseSignInSubmitQuiz: "Veuillez vous connecter pour soumettre vos réponses au quiz.",
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