import { requireAnonymous } from "@/lib/auth.server";
import LoginFormClient from "./components/login-form-client";

const LoginPage = async () => {
  // await requireAnonymous();
  return <LoginFormClient />;
};

export default LoginPage;
