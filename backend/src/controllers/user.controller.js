import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler } from "../utils/errors.js";

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    role: z.enum(["ADMIN", "STUDENT"]).optional(),
    isActive: z.boolean().optional()
  })
});

export const userStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean()
  })
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" }
  });
  res.json(users);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { id: true, name: true, email: true, role: true, isActive: true, attempts: true }
  });
  res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: req.body,
    select: { id: true, name: true, email: true, role: true, isActive: true }
  });
  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export const setUserStatus = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { isActive: req.body.isActive },
    select: { id: true, name: true, email: true, role: true, isActive: true }
  });
  res.json(user);
});
