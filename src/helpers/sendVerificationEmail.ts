import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Random Message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "succesfully send verification email" };
  } catch (error) {
    console.error("Error in verification email", error);
    return { success: false, message: "faild to send verification email" };
  }
}
