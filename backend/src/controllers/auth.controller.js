import { z } from "zod";
import { prisma } from "../db.js";
import { ApiError, asyncHandler } from "../utils/errors.js";
import { hashPassword, signToken, verifyPassword } from "../utils/auth.js";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email().toLowerCase(),
    password: z.string().min(8),
    role: z.enum(["ADMIN", "STUDENT"]).default("STUDENT")
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase(),
    password: z.string().min(1)
  })
});

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive
});

export const register = asyncHandler(async (req, res) => {
  const exists = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (exists) throw new ApiError(409, "Email is already registered");

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      passwordHash: await hashPassword(req.body.password),
      role: req.body.role
    }
  });

  res.status(201).json({ user: publicUser(user), token: signToken(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (!user || !(await verifyPassword(req.body.password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (!user.isActive) throw new ApiError(403, "Account is deactivated");

  res.json({ user: publicUser(user), token: signToken(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ message: "Logged out successfully" });
});

export const forgotPassword = asyncHandler(async (_req, res) => {
  res.json({ message: "Password reset flow placeholder created for email integration" });
});

export const resetPassword = asyncHandler(async (_req, res) => {
  res.json({ message: "Password reset endpoint placeholder created" });
});
