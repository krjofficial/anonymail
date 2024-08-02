import { resend } from "@/lib/resend"; // @ - src 
import VerificationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> { // promisc which gets returned is in the format of api response
  try {
    return { success: true, message: "Verification Email sent Successfully"}
  } catch (emailError) {
    console.error("Error sending verification email", emailError)
    return { success: false, message: "Failed to send verification email"}
  }
}


