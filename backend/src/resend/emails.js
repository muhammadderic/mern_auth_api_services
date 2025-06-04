import {
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import resend from "./resend.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error.message);
    throw new Error(`Error sending verification email: ${error}`);
  }
};