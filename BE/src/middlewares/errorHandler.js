export function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err);

  if (res.headersSent) return next(err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ success: false, error: message });
}

export default errorHandler;
