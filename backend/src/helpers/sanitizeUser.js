export function sanitizeUser(user) {
  // Convert Mongoose document to plain JS object
  const obj = user.toObject();

  // Remove sensitive or internal fields
  delete obj.password;
  // delete obj.resetPasswordToken;
  // delete obj.resetPasswordExpiresAt;
  // delete obj.verificationToken;
  // delete obj.verificationTokenExpiresAt;

  return obj;
}
