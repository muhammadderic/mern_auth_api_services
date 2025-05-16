export function responseHandler(res, { status = 200, success = true, message = "", data = null, error = null }) {
  return res.status(status).json({
    success,
    message,
    ...(data && { data }),
    ...(error && { error })
  });
}