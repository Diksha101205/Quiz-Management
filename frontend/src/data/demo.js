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
  { userId: "1", name: "Aarav Sharma", totalScore: 92, attempts: 6 },
  { userId: "2", name: "Nia Patel", totalScore: 88, attempts: 5 },
  { userId: "3", name: "Demo Student", totalScore: 74, attempts: 4 }
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
