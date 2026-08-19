import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/auth.js";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@quiz.local" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@quiz.local",
      passwordHash: await hashPassword("Admin@12345"),
      role: "ADMIN"
    }
  });

  await prisma.user.upsert({
    where: { email: "student@quiz.local" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@quiz.local",
      passwordHash: await hashPassword("Student@12345"),
      role: "STUDENT"
    }
  });

  const demoNames = [
    "Aarav Sharma",
    "Nia Patel",
    "Ishaan Verma",
    "Meera Rao",
    "Kabir Singh",
    "Anaya Gupta",
    "Riya Shah",
    "Vihaan Joshi",
    "Sara Khan",
    "Arjun Mehta",
    "Diya Iyer",
    "Reyansh Jain",
    "Tara Nair",
    "Advik Bose",
    "Kiara Das",
    "Neil Kapoor",
    "Aisha Malik",
    "Dev Patel",
    "Zoya Thomas",
    "Pooja Menon"
  ];

  const demoStudents = [];
  for (const [index, name] of demoNames.entries()) {
    demoStudents.push(await prisma.user.upsert({
      where: { email: `student${index + 1}@quiz.local` },
      update: {},
      create: {
        name,
        email: `student${index + 1}@quiz.local`,
        passwordHash: await hashPassword("Student@12345"),
        role: "STUDENT"
      }
    }));
  }

  const category = await prisma.category.upsert({
    where: { name: "Web Development" },
    update: {},
    create: { name: "Web Development" }
  });

  await prisma.quizAttempt.deleteMany({
    where: {
      userId: { in: demoStudents.map((student) => student.id) },
      quiz: { title: "React Basics" }
    }
  });

  let quiz = await prisma.quiz.findFirst({
    where: { title: "React Basics", categoryId: category.id }
  });

  if (!quiz) {
    quiz = await prisma.quiz.create({
      data: {
        title: "React Basics",
        description: "A short quiz covering components, state, and JSX.",
        durationMinutes: 10,
        difficulty: "EASY",
        isPublished: true,
        maxAttempts: 3,
        passingScorePercent: 60,
        categoryId: category.id,
        questions: {
          create: [
            {
              text: "What is JSX?",
              options: ["A database", "A syntax extension for JavaScript", "A CSS framework", "A package manager"],
              correctIndex: 1,
              explanation: "JSX lets developers describe UI with XML-like syntax inside JavaScript.",
              points: 2
            },
            {
              text: "Which hook stores component state?",
              options: ["useRoute", "useState", "useFetch", "useStyle"],
              correctIndex: 1,
              explanation: "useState stores local component state and gives a setter function to update it.",
              points: 2
            }
          ]
        }
      }
    });
  }

  await Promise.all(demoStudents.map((student, index) => prisma.quizAttempt.create({
    data: {
      userId: student.id,
      quizId: quiz.id,
      status: "SUBMITTED",
      answers: {},
      score: Math.max(1, 20 - index),
      totalPoints: 20,
      percentage: Math.max(5, 100 - index * 4),
      passed: index < 11,
      submittedAt: new Date()
    }
  })));

  console.log(`Seed complete. Admin ${admin.email}. Demo quiz ${quiz.title}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
