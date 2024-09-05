import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplate.js";

import { mailtrapClient, sender } from "./mailtrap.js";

// Send verification email
export const sendVerificationEmail = async (email, verificationCode) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode
      ),
      category: "Email verificationCode",
    });

    console.log("VERIFICATION EMAIL SENT SUCCESSFULLY", response);
  } catch (error) {
    console.log(`ERROR SENDING VERIFICATION EMAIL:`, error);
    throw new Error(`ERROR SENDING VERIFICATION EMAIL: ${error}`);
  }
};

// Welcome email
export const sendWelcomeEmail = async (email, name) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "3311dd23-0aea-4a0a-aa8d-fa4c37e380a0",
      template_variables: {
        company_info_name: "Auth-Verification",
        name: name,
      },
    });

    console.log("WELCOME EMAIL SENT SUCCESSFULLY", response);
  } catch (error) {
    console.log(`ERROR SENDING WELCOME EMAIL:`, error);
    throw new Error(`ERROR SENDING WELCOME EMAIL: ${error}`);
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });

    console.log("PASSWORD RESET EMAIL SENT SUCCESSFULLY", response);
  } catch (error) {
    console.log(`ERROR SENDING PASSWORD RESET EMAIL:`, error);
    throw new Error(`ERROR SENDING PASSWORD RESET EMAIL: ${error}`);
  }
};

// Send password reset success email
export const sendResetSuccessEmail = async (email) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Password reset success",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log("PASSWORD RESET SUCCESS EMAIL SENT SUCCESSFULLY:", response);
  } catch (error) {
    console.log(`ERROR SENDING RESET SUCCESS EMAIL:`, error);
    throw new Error(`ERROR SENDING RESET SUCCESS EMAIL: ${error}`);
  }
};
