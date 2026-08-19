import { ApiError } from "../utils/errors.js";

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    return next(new ApiError(400, result.error.issues[0]?.message || "Invalid request"));
  }

  req.body = result.data.body ?? req.body;
  req.params = result.data.params ?? req.params;
  req.query = result.data.query ?? req.query;
  next();
};

