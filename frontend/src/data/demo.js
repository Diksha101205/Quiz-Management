export const demoQuizzes = [
  {
    id: "demo-react",
    title: "React Basics",
    description: "Components, JSX, state, and simple UI thinking.",
    durationMinutes: 10,
    passingScorePercent: 60,
    difficulty: "EASY",
    category: { name: "Web Development" },
    _count: { questions: 8, attempts: 46 }
  },
  {
    id: "demo-db",
    title: "Database Foundations",
    description: "Tables, relationships, indexes, and safer queries.",
    durationMinutes: 15,
    passingScorePercent: 60,
    difficulty: "MEDIUM",
    category: { name: "Backend" },
    _count: { questions: 12, attempts: 31 }
  }
];

export const demoLeaderboard = [
  { userId: "1", name: "Aarav Sharma", totalScore: 192, attempts: 6, averagePercentage: 96 },
  { userId: "2", name: "Nia Patel", totalScore: 184, attempts: 6, averagePercentage: 92 },
  { userId: "3", name: "Ishaan Verma", totalScore: 176, attempts: 5, averagePercentage: 88 },
  { userId: "4", name: "Meera Rao", totalScore: 168, attempts: 5, averagePercentage: 84 },
  { userId: "5", name: "Kabir Singh", totalScore: 160, attempts: 5, averagePercentage: 80 },
  { userId: "6", name: "Anaya Gupta", totalScore: 154, attempts: 5, averagePercentage: 77 },
  { userId: "7", name: "Riya Shah", totalScore: 149, attempts: 4, averagePercentage: 74.5 },
  { userId: "8", name: "Vihaan Joshi", totalScore: 143, attempts: 4, averagePercentage: 71.5 },
  { userId: "9", name: "Sara Khan", totalScore: 138, attempts: 4, averagePercentage: 69 },
  { userId: "10", name: "Arjun Mehta", totalScore: 132, attempts: 4, averagePercentage: 66 },
  { userId: "11", name: "Diya Iyer", totalScore: 126, attempts: 4, averagePercentage: 63 },
  { userId: "12", name: "Reyansh Jain", totalScore: 120, attempts: 3, averagePercentage: 60 },
  { userId: "13", name: "Tara Nair", totalScore: 116, attempts: 3, averagePercentage: 58 },
  { userId: "14", name: "Advik Bose", totalScore: 112, attempts: 3, averagePercentage: 56 },
  { userId: "15", name: "Kiara Das", totalScore: 108, attempts: 3, averagePercentage: 54 },
  { userId: "16", name: "Neil Kapoor", totalScore: 104, attempts: 3, averagePercentage: 52 },
  { userId: "17", name: "Aisha Malik", totalScore: 100, attempts: 3, averagePercentage: 50 },
  { userId: "18", name: "Dev Patel", totalScore: 96, attempts: 2, averagePercentage: 48 },
  { userId: "19", name: "Zoya Thomas", totalScore: 92, attempts: 2, averagePercentage: 46 },
  { userId: "20", name: "Demo Student", totalScore: 88, attempts: 2, averagePercentage: 44 }
];

export const demoAttempts = [
  {
    id: "demo-attempt-1",
    score: 8,
    totalPoints: 10,
    percentage: 80,
    passed: true,
    status: "SUBMITTED",
    startedAt: "2026-08-15T09:00:00.000Z",
    quiz: { title: "React Basics", category: { name: "Web Development" } }
  },
  {
    id: "demo-attempt-2",
    score: 6,
    totalPoints: 10,
    percentage: 60,
    passed: true,
    status: "SUBMITTED",
    startedAt: "2026-08-16T09:00:00.000Z",
    quiz: { title: "Database Foundations", category: { name: "Backend" } }
  },
  {
    id: "demo-attempt-3",
    score: 4,
    totalPoints: 10,
    percentage: 40,
    passed: false,
    status: "SUBMITTED",
    startedAt: "2026-08-17T09:00:00.000Z",
    quiz: { title: "API Security", category: { name: "Backend" } }
  }
];

export const demoQuizDetails = {
  "demo-react": {
    id: "demo-react",
    title: "React Basics",
    durationMinutes: 10,
    passingScorePercent: 60,
    questions: [
      { id: "react-1", text: "What does JSX help you write?", options: ["SQL queries", "UI markup in JavaScript", "Server logs", "Database indexes"], correctIndex: 1, explanation: "JSX is commonly used to describe React UI in JavaScript.", points: 1 },
      { id: "react-2", text: "Which hook stores component state?", options: ["useState", "useRoute", "useTable", "useStyle"], correctIndex: 0, explanation: "useState returns a state value and a function that updates it.", points: 1 }
    ]
  },
  "demo-db": {
    id: "demo-db",
    title: "Database Foundations",
    durationMinutes: 15,
    passingScorePercent: 60,
    questions: [
      { id: "db-1", text: "What does a primary key identify?", options: ["A unique row", "A stylesheet", "A server port", "A browser event"], correctIndex: 0, explanation: "A primary key uniquely identifies each row in a table.", points: 1 },
      { id: "db-2", text: "Which language is commonly used for relational database queries?", options: ["HTML", "SQL", "CSS", "Markdown"], correctIndex: 1, explanation: "SQL is the standard query language for relational databases.", points: 1 }
    ]
  }
};
