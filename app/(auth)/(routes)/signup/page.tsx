import { requireAnonymous } from "@/lib/auth.server";
import { Metadata } from "next";
import SignupFormClient from "./components/signup-form-client";

export const metadata: Metadata = {
  title: "Sign Up Page | Bloomflow Workshop",
};

const SignUpPage = async () => {
  await requireAnonymous();
  return <SignupFormClient />;
};

export default SignUpPage;
