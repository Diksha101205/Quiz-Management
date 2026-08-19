export const notFound = (_req, _res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: statusCode === 500 && process.env.NODE_ENV === "production" ? "Something went wrong" : error.message
  });
};
