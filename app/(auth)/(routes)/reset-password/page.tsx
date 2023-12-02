import { resetPasswordUsernameSessionKey } from "@/actions/auth/constants";
import { getCurrentSession } from "@/lib/manage-session";
import { Metadata } from "next";
import ResetPasswordFormClient from "./components/reset-password-form-client";

export const metadata: Metadata = {
  title: "Reset Password Page | AfricaZon",
};

const ResetPasswordPage = async () => {
  const username = getCurrentSession(resetPasswordUsernameSessionKey);
  return <ResetPasswordFormClient resetPasswordUsername={username} />;
};
export default ResetPasswordPage;
