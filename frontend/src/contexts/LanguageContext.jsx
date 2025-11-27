import React, { createContext, useContext, useState, useEffect } from 'react';

// Comprehensive translations for EN and FR
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
    accessAdminDashboard: "Access Admin Dashboard",
    logOut: "Log out",
    signedInAs: "Signed in as",
    dashboard: "Dashboard",

    // Common Actions
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    submit: "Submit",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    loading: "Loading",
    search: "Search",
    filter: "Filter",
    export: "Export",

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
    correct: "Correct",
    incorrect: "Incorrect",
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
    completedBadge: "Completed",
    newBadge: "New",

    // Quiz Results Messages
    outstandingPerformance: "Outstanding Performance!",
    greatJob: "Great Job!",
    wellDone: "Well Done!",
    keepPracticing: "Keep Practicing!",
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
    hurry: "Hurry!",
    questionNotAvailable: "Question not available",
    optionsNotAvailable: "Question options are not available. Please try refreshing the page.",
    loadingQuiz: "Loading Quiz...",
    pleaseWait: "Please wait while we load the quiz questions.",
    submitting: "Submitting...",

    // Admin Dashboard
    adminDashboard: "Dashboard",
    analytics: "Quiz Analytics",
    feedback: "Feedback",
    users: "Users",
    settings: "Settings",
    welcomeBack: "Welcome back",
    totalAttempts: "Total Attempts",
    completionRate: "Completion Rate",
    totalUsers: "Total Users",
    topQuiz: "Top Quiz",
    quickActions: "Quick Actions",
    takeQuiz: "Take Quiz",
    viewAnalytics: "View Analytics",
    viewFeedback: "View Feedback",
    latestFeedback: "Latest Feedback",
    seeAll: "See all",
    noFeedback: "No feedback yet",
    recentAttempts: "Recent Attempts",
    quiz: "Quiz",
    status: "Status",
    date: "Date",
    completed: "Completed",
    noAttempts: "No quiz attempts yet",
    signOut: "Sign Out",
    days: "Days",

    // Admin Quiz Stats
    quizAnalytics: "Quiz Analytics",
    comprehensiveStats: "Comprehensive statistics and insights for all quizzes",
    selectQuiz: "Select Quiz",
    selectQuizPrompt: "Select a Quiz",
    chooseQuizSidebar: "Choose a quiz from the sidebar to view detailed analytics",
    loadingStatistics: "Loading statistics...",
    exportCSV: "Export CSV",
    exportPDF: "Export PDF",
    passRate: "Pass Rate",
    performanceMetrics: "Performance Metrics",
    highestScore: "Highest Score",
    lowestScore: "Lowest Score",
    averageScore: "Average Score",
    medianScore: "Median Score",
    fastestTime: "Fastest Time",
    slowestTime: "Slowest Time",
    averageTime: "Average Time",
    engagementStats: "Engagement Statistics",
    retryRate: "Retry Rate",
    averageAttempts: "Average Attempts",
    completionTrend: "Completion Trend",
    upTrend: "up from last period",
    downTrend: "down from last period",
    scoreDistribution: "Score Distribution",
    noDistributionData: "No distribution data available",
    attemptNumber: "Attempt #",
    unknownUser: "Unknown User",

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

    // Learning Path
    yourLearningPath: "Your Learning Path",
    completeModules: "Complete each module to unlock the next. Progress through all modules to become scam-savvy!",
    backToChoice: "Back to Learning Choice",
    progress: "Progress",
    lessons: "Lessons",
    startModule: "Start Module",
    continueModule: "Continue Module",
    unlockPrevious: "Complete the previous module to unlock this one",
    backToModules: "Back to Modules",
    lessonOverview: "Lesson Overview",
    previousLesson: "Previous Lesson",
    nextLesson: "Next Lesson",
    finishModule: "Finish Module",

    // Free Learning
    exploreCategories: "Explore Scam Categories",
    chooseScamType: "Choose a type of scam to explore its learning library.",
    emailScamsTitle: "Email Scams",
    spotPhishingEmails: "Spot phishing emails and fake attachments.",
    callScamsTitle: "Call Scams",
    detectFakeTech: "Detect fake tech support and suspicious phone calls.",
    onlineScamsTitle: "Online Scams",
    identifyFakeWebsitesShort: "Identify fake websites, phishing links, and fraudulent offers.",
    learningLibraries: "Learning Libraries",
    courses: "Courses",
    viewDetails: "View Details",
    start: "Start",
    continueLearning: "Continue Learning",

    // Levels & Times
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    minutes: "mins",

    // Auth/Login
    createAccount: "Create Account",
    emailAddress: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign Up",
    forgotPasswordLink: "Forgot Password?",

    // Errors
    error: "Error",
    loadingDashboard: "Loading dashboard...",
    failedToLoad: "Failed to load",
    retry: "Retry",

    // Footer
    allRightsReserved: "All rights reserved",

    // ResetPassword (note: fullName and feedback were removed as duplicates from earlier sections)
    resetPassword: "Reset Password",
    resetPasswordFor: "Reset password for",
    enterPassword: "Enter Password",
    passwordMustBe8Chars: "Password must be at least 8 characters.",
    passwordMustHaveSpecial: "Password must contain at least one special character.",
    passwordsDoNotMatch: "Passwords do not match.",
    passwordResetSuccess: "Password reset successful (mock). You can now sign in.",
    rememberedPassword: "Remembered your password?",
    everyClickMatters: "Every click matters.",
    learnToClickSmart: "Learn to click smart.",

    // ForgotPassword
    forgotPassword: "Forgot Password",
    enterEmailForReset: "Enter your email address or mobile number to receive password reset instructions",
    enterEmailId: "Enter Email Id",

    // OTPVerification
    otpVerification: "OTP Verification",
    codeIsSentTo: "Code is sent to",
    checkYourInbox: "Please check your inbox",
    verify: "Verify",
    resendCodeIn: "Resend code in",
    resendCode: "Resend code",
    enterFullCode: "Enter the full code",
    verificationCodeResent: "Verification code resent (mock).",

    // FeedbackChat
    quickFeedback: "Quick Feedback",
    answerQuickQuestions: "Answer a few quick questions — should take under a minute.",
    satisfactionQuestion: "Overall, how satisfied are you with the app?",
    satisfactionHint: "1 = Very dissatisfied, 5 = Very satisfied",
    whatLikedMost: "What did you like most about the app?",
    likedMostPlaceholder: "Features, UX, content, etc.",
    whatCanImprove: "What can we improve?",
    improvePlaceholder: "Bugs, missing features, clarity...",
    wouldRecommend: "Would you recommend GuardEd to a friend or colleague?",
    yes: "Yes",
    maybe: "Maybe",
    no: "No",
    otherComments: "Any other comments or suggestions?",
    optional: "Optional",
    tapToRate: "Tap to rate",
    allResponsesAnonymous: "All responses are anonymous unless you choose otherwise.",
    thanksFeedback: "🎉 Thanks for your feedback!",
    appreciateHelp: "We appreciate you taking the time to help improve",
    submitAnother: "Submit Another",
    failedToSendFeedback: "Failed to send feedback. Please try again.",

    // FeedbackFab
    openFeedback: "Open feedback",

    // CallLibrary
    backToLearn: "Back to Learn",
    callScamLibrary: "Call Scam Learning Library",
    commonPhoneScripts: "Common Phone Scam Scripts",
    phoneScriptsDesc: "Examples of fake tech support, lottery scams, and government impersonations.",
    threateningLanguage: "Recognizing Threatening Language",
    threateningLanguageDesc: "Understand how scammers use fear and urgency to make victims comply.",
    protectingSeniors: "Protecting Seniors from Call Scams",
    protectingSeniorsDesc: "Simple steps and scripts to help elderly individuals stay safe.",

    // EmailLibrary
    emailScamLibrary: "Email Scam Learning Library",
    recognizingPhishing: "Recognizing Phishing Emails",
    recognizingPhishingDesc: "Learn to identify common phishing tactics such as fake links, urgent tone, and spoofed senders.",
    avoidingAttachments: "Avoiding Malicious Attachments",
    avoidingAttachmentsDesc: "Understand the risks of attachments and how scammers use them to install malware.",
    spottingFakeInvoices: "Spotting Fake Invoices",
    spottingFakeInvoicesDesc: "Explore how fake billing scams target businesses and individuals via email.",

    // LoginPage
    welcomeToGuardEd: "Welcome to GuardEd!",
    login: "Login",

    // QuizEditor
    quizQuestionsEditor: "Quiz / Questions Editor",
    createQuestionsModule: "Create questions and assign them to a module.",
    phishingAwareness: "Phishing Awareness",
    passwordSafety: "Password Safety",
    socialEngineering: "Social Engineering",
    saved: "Saved",
    saveAll: "Save All",
    quizTitle: "Quiz Title",
    enterQuizTitle: "Enter quiz title",
    questionText: "Question text",
    type: "Type",
    multipleChoice: "Multiple Choice",
    textShortAnswer: "Text / Short Answer",
    points: "Points",
    order: "Order",
    choices: "Choices",
    choice: "Choice",
    remove: "Remove",
    addChoice: "+ Add choice",
    addQuestion: "Add question",
    clear: "Clear",
    questionsInDraft: "Questions in this draft",
    noQuestionsYet: "No questions yet — add one from the left panel.",
    empty: "empty",
    untitledQuestion: "Untitled question",

    // UsersList
    userManagement: "User Management",
    searchUsers: "Search users...",
    email: "Email",
    user: "User",
    admin: "Admin",
    adding: "Adding...",
    addUser: "➕ Add User",
    role: "Role",
    created: "Created",
    action: "Action",
    noUsersFound: "No users found",
    loadingUsers: "Loading users...",
    userCreatedSuccess: "✅ User created successfully!",
    userDeletedSuccess: "✅ User deleted successfully!",
    areYouSureDelete: "Are you sure you want to delete this user?",
    firebaseError: "⚠️ Firebase error:",
    failedToFetchUsers: "Failed to fetch users",

    // OnlineLibrary
    onlineScamLibrary: "Online Scam Learning Library",
    identifyingFakeWebsites: "Identifying Fake Websites",
    identifyingFakeWebsitesDesc: "Learn how to spot fraudulent websites, check URLs, and verify site legitimacy.",
    avoidingOnlineMarketplace: "Avoiding Online Marketplace Scams",
    avoidingOnlineMarketplaceDesc: "Understand common tactics used in online shopping and marketplace fraud.",
    protectingPersonalInfo: "Protecting Personal Information Online",
    protectingPersonalInfoDesc: "Best practices for keeping your data safe while browsing and shopping online.",

    // UserProfile - Quiz Preferences
    quizPreferences: "Quiz Preferences",
    shuffleQuestions: "Shuffle Questions",
    shuffleAnswers: "Shuffle Answers",
    showCorrectAnswersAfter: "Show Correct Answers After Submission",
    allowRetry: "Allow Retry",
    autoSaveProgress: "Auto-Save Progress",
    resetQuizProgress: "Reset Quiz Progress",
    resetQuizProgressDesc: "This will delete all your completed quizzes, allowing you to retake them. Your badges will remain unchanged.",
    resetAllQuizProgress: "Reset All Quiz Progress",

    // UserProfile - Notifications
    notificationsTab: "Notifications",
    emailNotifications: "Email Notifications",
    inWebNotifications: "In-Web Notifications",
    weeklySummary: "Weekly Summary",
    quizAlerts: "Quiz Alerts",

    // UserProfile - Danger Zone
    dangerZone: "Danger Zone",
    deleteAccountWarning: "Once you delete your account, there is no going back. Please be certain.",
    deleteAccount: "Delete Account",
    backToHome: "Back to Home",
    enterFullName: "Enter your full name",
    pleaseSignInProfile: "Please sign in to view your profile",
    profileTab: "Profile",

    // UserProfile - Additional Fields
    emailCannotBeChanged: "Email cannot be changed",
    changePassword: "Change Password",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    saving: "Saving...",
    accountRole: "Account Role",
    userRole: "User",
    yourBadgesTitle: "Your Badges",
    loadingBadges: "Loading badges...",
    noBadgesYet: "No badges yet",
    completQuizzesToEarnBadges: "Complete quizzes to earn badges",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    changePasswordTitle: "Change Password",
    enterCurrentPassword: "Enter current password",
    enterNewPassword: "Enter new password",
    confirmPasswordPlaceholder: "Re-enter new password",
    updatePassword: "Update Password",
    passwordMinLength: "Password must be at least 6 characters",
    currentPasswordIncorrect: "Current password is incorrect",
    passwordChangedSuccessfully: "Password changed successfully!",
    failedToChangePassword: "Failed to change password",
    profileUpdatedSuccessfully: "Profile updated successfully!",
    failedToSaveChanges: "Failed to save changes",
    pleaseEnterPhotoUrl: "Please enter a photo URL",
    photoUpdatedSuccessfully: "Photo updated successfully!",
    failedToUpdatePhoto: "Failed to update photo",
    accountDeletedSuccessfully: "Account deleted successfully",
    failedToDeleteAccount: "Failed to delete account",
    quizProgressResetSuccess: "Quiz progress reset successfully!",
    failedToResetQuiz: "Failed to reset quiz progress",
    emailPlaceholder: "your@email.com",
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
    accessAdminDashboard: "Accéder au tableau de bord admin",
    logOut: "Se déconnecter",
    signedInAs: "Connecté en tant que",
    dashboard: "Tableau de bord",

    // Common Actions
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    submit: "Soumettre",
    close: "Fermer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    loading: "Chargement",
    search: "Rechercher",
    filter: "Filtrer",
    export: "Exporter",

    // Quiz Section
    browseQuizzes: "Parcourir les quiz",
    completedQuizzes: "Quiz complétés",
    startQuiz: "Commencer",
    retryQuiz: "Réessayer le quiz",
    exitQuiz: "Quitter le quiz",
    submitQuiz: "Soumettre le quiz",
    quizResults: "Résultats du quiz",
    score: "Score",
    percentage: "Pourcentage",
    timeTaken: "Temps écoulé",
    timeLeft: "Temps restant",
    question: "Question",
    yourAnswer: "Votre réponse",
    correctAnswer: "Réponse correcte",
    correct: "Correct",
    incorrect: "Incorrect",
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
    completedBadge: "Complété",
    newBadge: "Nouveau",

    // Quiz Results Messages
    outstandingPerformance: "Performance exceptionnelle!",
    greatJob: "Excellent travail!",
    wellDone: "Bien joué!",
    keepPracticing: "Continuez à pratiquer!",
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
    hurry: "Dépêchez-vous!",
    questionNotAvailable: "Question non disponible",
    optionsNotAvailable: "Les options de la question ne sont pas disponibles. Veuillez rafraîchir la page.",
    loadingQuiz: "Chargement du quiz...",
    pleaseWait: "Veuillez patienter pendant que nous chargeons les questions du quiz.",
    submitting: "Envoi en cours...",

    // Admin Dashboard
    adminDashboard: "Tableau de bord",
    analytics: "Analyses des quiz",
    feedback: "Commentaires",
    users: "Utilisateurs",
    settings: "Paramètres",
    welcomeBack: "Bon retour",
    totalAttempts: "Total des tentatives",
    completionRate: "Taux de complétion",
    totalUsers: "Total des utilisateurs",
    topQuiz: "Quiz principal",
    quickActions: "Actions rapides",
    takeQuiz: "Faire un quiz",
    viewAnalytics: "Voir les analyses",
    viewFeedback: "Voir les commentaires",
    latestFeedback: "Derniers commentaires",
    seeAll: "Tout voir",
    noFeedback: "Aucun commentaire pour le moment",
    recentAttempts: "Tentatives récentes",
    quiz: "Quiz",
    status: "Statut",
    date: "Date",
    completed: "Complété",
    noAttempts: "Aucune tentative de quiz pour le moment",
    signOut: "Se déconnecter",
    days: "Jours",

    // Admin Quiz Stats
    quizAnalytics: "Analyses des quiz",
    comprehensiveStats: "Statistiques et analyses complètes pour tous les quiz",
    selectQuiz: "Sélectionner un quiz",
    selectQuizPrompt: "Sélectionnez un quiz",
    chooseQuizSidebar: "Choisissez un quiz dans la barre latérale pour voir les analyses détaillées",
    loadingStatistics: "Chargement des statistiques...",
    exportCSV: "Exporter CSV",
    exportPDF: "Exporter PDF",
    passRate: "Taux de réussite",
    performanceMetrics: "Métriques de performance",
    highestScore: "Score le plus élevé",
    lowestScore: "Score le plus bas",
    averageScore: "Score moyen",
    medianScore: "Score médian",
    fastestTime: "Temps le plus rapide",
    slowestTime: "Temps le plus lent",
    averageTime: "Temps moyen",
    engagementStats: "Statistiques d'engagement",
    retryRate: "Taux de tentatives",
    averageAttempts: "Tentatives moyennes",
    completionTrend: "Tendance de complétion",
    upTrend: "en hausse par rapport à la période précédente",
    downTrend: "en baisse par rapport à la période précédente",
    scoreDistribution: "Distribution des scores",
    noDistributionData: "Aucune donnée de distribution disponible",
    attemptNumber: "Tentative #",
    unknownUser: "Utilisateur inconnu",

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

    // Learning Path
    yourLearningPath: "Votre parcours d'apprentissage",
    completeModules: "Complétez chaque module pour débloquer le suivant. Progressez à travers tous les modules pour devenir expert en arnaques!",
    backToChoice: "Retour au choix d'apprentissage",
    progress: "Progression",
    lessons: "Leçons",
    startModule: "Commencer le module",
    continueModule: "Continuer le module",
    unlockPrevious: "Complétez le module précédent pour débloquer celui-ci",
    backToModules: "Retour aux modules",
    lessonOverview: "Aperçu de la leçon",
    previousLesson: "Leçon précédente",
    nextLesson: "Leçon suivante",
    finishModule: "Terminer le module",

    // Free Learning
    exploreCategories: "Explorer les catégories d'arnaques",
    chooseScamType: "Choisissez un type d'arnaque pour explorer sa bibliothèque d'apprentissage.",
    emailScamsTitle: "Arnaques par email",
    spotPhishingEmails: "Repérer les emails de phishing et les fausses pièces jointes.",
    callScamsTitle: "Arnaques téléphoniques",
    detectFakeTech: "Détecter le faux support technique et les appels suspects.",
    onlineScamsTitle: "Arnaques en ligne",
    identifyFakeWebsitesShort: "Identifier les faux sites web, liens de phishing et offres frauduleuses.",
    learningLibraries: "Bibliothèques d'apprentissage",
    courses: "Cours",
    viewDetails: "Voir les détails",
    start: "Commencer",
    continueLearning: "Continuer l'apprentissage",

    // Levels & Times
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
    minutes: "mins",

    // Auth/Login
    createAccount: "Créer un compte",
    emailAddress: "Adresse e-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    fullName: "Nom complet",
    alreadyHaveAccount: "Vous avez déjà un compte?",
    dontHaveAccount: "Vous n'avez pas de compte?",
    signUp: "S'inscrire",
    forgotPasswordLink: "Mot de passe oublié?",

    // Errors
    error: "Erreur",
    loadingDashboard: "Chargement du tableau de bord...",
    failedToLoad: "Échec du chargement",
    retry: "Réessayer",

    // Footer
    allRightsReserved: "Tous droits réservés",

    // ResetPassword
    resetPassword: "Réinitialiser le mot de passe",
    resetPasswordFor: "Réinitialiser le mot de passe pour",
    enterPassword: "Entrer le mot de passe",
    passwordMustBe8Chars: "Le mot de passe doit contenir au moins 8 caractères.",
    passwordMustHaveSpecial: "Le mot de passe doit contenir au moins un caractère spécial.",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas.",
    passwordResetSuccess: "Réinitialisation du mot de passe réussie (simulé). Vous pouvez maintenant vous connecter.",
    rememberedPassword: "Vous vous souvenez de votre mot de passe?",
    everyClickMatters: "Chaque clic compte.",
    learnToClickSmart: "Apprenez à cliquer intelligemment.",

    // ForgotPassword (note: forgotPassword already exists at line 530 as "Mot de passe oublié?")
    enterEmailForReset: "Entrez votre adresse e-mail ou numéro de mobile pour recevoir les instructions de réinitialisation du mot de passe",
    enterEmailId: "Entrer l'adresse e-mail",

    // OTPVerification
    otpVerification: "Vérification OTP",
    codeIsSentTo: "Le code est envoyé à",
    checkYourInbox: "Veuillez vérifier votre boîte de réception",
    verify: "Vérifier",
    resendCodeIn: "Renvoyer le code dans",
    resendCode: "Renvoyer le code",
    enterFullCode: "Entrez le code complet",
    verificationCodeResent: "Code de vérification renvoyé (simulé).",

    // FeedbackChat
    quickFeedback: "Commentaires rapides",
    answerQuickQuestions: "Répondez à quelques questions rapides — cela devrait prendre moins d'une minute.",
    satisfactionQuestion: "Dans l'ensemble, êtes-vous satisfait de l'application?",
    satisfactionHint: "1 = Très insatisfait, 5 = Très satisfait",
    whatLikedMost: "Qu'avez-vous le plus aimé dans l'application?",
    likedMostPlaceholder: "Fonctionnalités, UX, contenu, etc.",
    whatCanImprove: "Que pouvons-nous améliorer?",
    improvePlaceholder: "Bugs, fonctionnalités manquantes, clarté...",
    wouldRecommend: "Recommanderiez-vous GuardEd à un ami ou un collègue?",
    yes: "Oui",
    maybe: "Peut-être",
    no: "Non",
    otherComments: "Autres commentaires ou suggestions?",
    optional: "Optionnel",
    tapToRate: "Appuyez pour noter",
    allResponsesAnonymous: "Toutes les réponses sont anonymes sauf indication contraire.",
    thanksFeedback: "🎉 Merci pour votre commentaire!",
    appreciateHelp: "Nous apprécions que vous preniez le temps d'aider à améliorer",
    submitAnother: "Soumettre un autre",
    failedToSendFeedback: "Échec de l'envoi du commentaire. Veuillez réessayer.",

    // FeedbackFab
    openFeedback: "Ouvrir les commentaires",

    // CallLibrary
    backToLearn: "Retour à Apprendre",
    callScamLibrary: "Bibliothèque d'apprentissage sur les arnaques téléphoniques",
    commonPhoneScripts: "Scripts d'arnaques téléphoniques courants",
    phoneScriptsDesc: "Exemples de faux support technique, d'arnaques à la loterie et d'usurpations d'identité gouvernementales.",
    threateningLanguage: "Reconnaître le langage menaçant",
    threateningLanguageDesc: "Comprendre comment les escrocs utilisent la peur et l'urgence pour faire obéir les victimes.",
    protectingSeniors: "Protéger les personnes âgées des arnaques téléphoniques",
    protectingSeniorsDesc: "Étapes simples et scripts pour aider les personnes âgées à rester en sécurité.",

    // EmailLibrary
    emailScamLibrary: "Bibliothèque d'apprentissage sur les arnaques par e-mail",
    recognizingPhishing: "Reconnaître les e-mails de phishing",
    recognizingPhishingDesc: "Apprenez à identifier les tactiques de phishing courantes telles que les faux liens, le ton urgent et les expéditeurs usurpés.",
    avoidingAttachments: "Éviter les pièces jointes malveillantes",
    avoidingAttachmentsDesc: "Comprenez les risques des pièces jointes et comment les escrocs les utilisent pour installer des logiciels malveillants.",
    spottingFakeInvoices: "Repérer les fausses factures",
    spottingFakeInvoicesDesc: "Découvrez comment les fausses arnaques de facturation ciblent les entreprises et les particuliers par e-mail.",

    // LoginPage
    welcomeToGuardEd: "Bienvenue sur GuardEd!",
    login: "Connexion",

    // QuizEditor
    quizQuestionsEditor: "Éditeur de quiz / questions",
    createQuestionsModule: "Créez des questions et assignez-les à un module.",
    phishingAwareness: "Sensibilisation au phishing",
    passwordSafety: "Sécurité des mots de passe",
    socialEngineering: "Ingénierie sociale",
    saved: "Enregistré",
    saveAll: "Tout enregistrer",
    quizTitle: "Titre du quiz",
    enterQuizTitle: "Entrez le titre du quiz",
    questionText: "Texte de la question",
    type: "Type",
    multipleChoice: "Choix multiples",
    textShortAnswer: "Texte / Réponse courte",
    points: "Points",
    order: "Ordre",
    choices: "Choix",
    choice: "Choix",
    remove: "Supprimer",
    addChoice: "+ Ajouter un choix",
    addQuestion: "Ajouter une question",
    clear: "Effacer",
    questionsInDraft: "Questions dans ce brouillon",
    noQuestionsYet: "Aucune question pour le moment — ajoutez-en une depuis le panneau de gauche.",
    empty: "vide",
    untitledQuestion: "Question sans titre",

    // UsersList
    userManagement: "Gestion des utilisateurs",
    searchUsers: "Rechercher des utilisateurs...",
    email: "E-mail",
    user: "Utilisateur",
    admin: "Admin",
    adding: "Ajout en cours...",
    addUser: "➕ Ajouter un utilisateur",
    role: "Rôle",
    created: "Créé",
    action: "Action",
    noUsersFound: "Aucun utilisateur trouvé",
    loadingUsers: "Chargement des utilisateurs...",
    userCreatedSuccess: "✅ Utilisateur créé avec succès!",
    userDeletedSuccess: "✅ Utilisateur supprimé avec succès!",
    areYouSureDelete: "Êtes-vous sûr de vouloir supprimer cet utilisateur?",
    firebaseError: "⚠️ Erreur Firebase:",
    failedToFetchUsers: "Échec du chargement des utilisateurs",

    // OnlineLibrary
    onlineScamLibrary: "Bibliothèque d'apprentissage sur les arnaques en ligne",
    identifyingFakeWebsites: "Identifier les faux sites web",
    identifyingFakeWebsitesDesc: "Apprenez à repérer les sites frauduleux, vérifier les URL et valider la légitimité des sites.",
    avoidingOnlineMarketplace: "Éviter les arnaques des marchés en ligne",
    avoidingOnlineMarketplaceDesc: "Comprenez les tactiques courantes utilisées dans les arnaques d'achat en ligne et sur les places de marché.",
    protectingPersonalInfo: "Protéger les informations personnelles en ligne",
    protectingPersonalInfoDesc: "Meilleures pratiques pour garder vos données en sécurité lors de la navigation et des achats en ligne.",

    // UserProfile - Quiz Preferences
    quizPreferences: "Préférences des quiz",
    shuffleQuestions: "Mélanger les questions",
    shuffleAnswers: "Mélanger les réponses",
    showCorrectAnswersAfter: "Afficher les bonnes réponses après soumission",
    allowRetry: "Autoriser les nouvelles tentatives",
    autoSaveProgress: "Sauvegarde automatique",
    resetQuizProgress: "Réinitialiser la progression des quiz",
    resetQuizProgressDesc: "Cela supprimera tous vos quiz complétés, vous permettant de les refaire. Vos badges resteront inchangés.",
    resetAllQuizProgress: "Réinitialiser toute la progression",

    // UserProfile - Notifications
    notificationsTab: "Notifications",
    emailNotifications: "Notifications par e-mail",
    inWebNotifications: "Notifications dans l'application",
    weeklySummary: "Résumé hebdomadaire",
    quizAlerts: "Alertes de quiz",

    // UserProfile - Danger Zone
    dangerZone: "Zone de danger",
    deleteAccountWarning: "Une fois votre compte supprimé, il n'y a pas de retour en arrière possible. Soyez certain de votre choix.",
    deleteAccount: "Supprimer le compte",
    backToHome: "Retour à l'accueil",
    enterFullName: "Entrez votre nom complet",
    pleaseSignInProfile: "Veuillez vous connecter pour voir votre profil",
    profileTab: "Profil",

    // UserProfile - Additional Fields
    emailCannotBeChanged: "L'adresse e-mail ne peut pas être modifiée",
    changePassword: "Changer le mot de passe",
    editProfile: "Modifier le profil",
    saveChanges: "Enregistrer les modifications",
    saving: "Enregistrement...",
    accountRole: "Rôle du compte",
    userRole: "Utilisateur",
    yourBadgesTitle: "Vos badges",
    loadingBadges: "Chargement des badges...",
    noBadgesYet: "Aucun badge pour le moment",
    completQuizzesToEarnBadges: "Complétez des quiz pour gagner des badges",
    currentPassword: "Mot de passe actuel",
    newPassword: "Nouveau mot de passe",
    confirmNewPassword: "Confirmer le nouveau mot de passe",
    changePasswordTitle: "Changer le mot de passe",
    enterCurrentPassword: "Entrez le mot de passe actuel",
    enterNewPassword: "Entrez le nouveau mot de passe",
    confirmPasswordPlaceholder: "Confirmez le nouveau mot de passe",
    updatePassword: "Mettre à jour le mot de passe",
    passwordMinLength: "Le mot de passe doit contenir au moins 6 caractères",
    currentPasswordIncorrect: "Le mot de passe actuel est incorrect",
    passwordChangedSuccessfully: "Mot de passe modifié avec succès!",
    failedToChangePassword: "Échec de la modification du mot de passe",
    profileUpdatedSuccessfully: "Profil mis à jour avec succès!",
    failedToSaveChanges: "Échec de l'enregistrement des modifications",
    pleaseEnterPhotoUrl: "Veuillez entrer une URL de photo",
    photoUpdatedSuccessfully: "Photo mise à jour avec succès!",
    failedToUpdatePhoto: "Échec de la mise à jour de la photo",
    accountDeletedSuccessfully: "Compte supprimé avec succès",
    failedToDeleteAccount: "Échec de la suppression du compte",
    quizProgressResetSuccess: "Progression des quiz réinitialisée avec succès!",
    failedToResetQuiz: "Échec de la réinitialisation de la progression",
    emailPlaceholder: "votre@email.com",
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('guarded_language') || 'EN';
    // Convert to lowercase for API compatibility
    const lowercase = saved.toLowerCase();
    console.log('🌍 LanguageContext initialized - saved:', saved, 'returning:', lowercase);
    return lowercase;
  });

  useEffect(() => {
    console.log('🌍 LanguageContext lang changed to:', lang, '- saving to localStorage as:', lang.toUpperCase());
    localStorage.setItem('guarded_language', lang.toUpperCase());
  }, [lang]);

  const toggleLanguage = () => {
    console.log('🌍 LanguageContext toggleLanguage called');
    setLang(prev => {
      const next = prev === 'en' ? 'fr' : 'en';
      console.log('🌍 LanguageContext toggling from', prev, 'to', next);
      return next;
    });
  };

  const t = (key) => {
    // Convert lang to uppercase for translation lookup
    return translations[lang.toUpperCase()][key] || key;
  };

  // Log whenever lang value is accessed
  useEffect(() => {
    console.log('🌍 LanguageContext current lang value:', lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { translations };