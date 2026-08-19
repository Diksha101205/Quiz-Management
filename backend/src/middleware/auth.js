import jwt from "jsonwebtoken";
import { prisma } from "../db.js";
import { ApiError } from "../utils/errors.js";

export const authenticate = async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return next(new ApiError(401, "Authentication required"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) throw new ApiError(401, "Invalid account");
    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, "Invalid or expired token"));
  }
};

export const optionalAuthenticate = async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (user?.isActive) req.user = user;
  } catch {
    req.user = null;
  }
  next();
};

export const requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new ApiError(403, "You do not have permission for this action"));
  }
  next();
};

export const requireAdmin = requireRole("ADMIN");
export const requireStudent = requireRole("STUDENT");
