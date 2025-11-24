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
    admin: "Access Admin Dashboard",
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
    forgotPassword: "Forgot Password?",

    // Errors
    error: "Error",
    loadingDashboard: "Loading dashboard...",
    failedToLoad: "Failed to load",
    retry: "Retry",

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
    forgotPassword: "Mot de passe oublié?",

    // Errors
    error: "Erreur",
    loadingDashboard: "Chargement du tableau de bord...",
    failedToLoad: "Échec du chargement",
    retry: "Réessayer",

    // Footer
    allRightsReserved: "Tous droits réservés",
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('guarded_language') || 'EN';
  });

  useEffect(() => {
    localStorage.setItem('guarded_language', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'EN' ? 'FR' : 'EN');
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

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