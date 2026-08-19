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

  const category = await prisma.category.upsert({
    where: { name: "Web Development" },
    update: {},
    create: { name: "Web Development" }
  });

  const quiz = await prisma.quiz.create({
    data: {
      title: "React Basics",
      description: "A short quiz covering components, state, and JSX.",
      durationMinutes: 10,
      difficulty: "EASY",
      isPublished: true,
      maxAttempts: 3,
      categoryId: category.id,
      questions: {
        create: [
          {
            text: "What is JSX?",
            options: ["A database", "A syntax extension for JavaScript", "A CSS framework", "A package manager"],
            correctIndex: 1,
            points: 2
          },
          {
            text: "Which hook stores component state?",
            options: ["useRoute", "useState", "useFetch", "useStyle"],
            correctIndex: 1,
            points: 2
          }
        ]
      }
    }
  });

  console.log(`Seed complete. Admin ${admin.email}. Demo quiz ${quiz.title}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());

