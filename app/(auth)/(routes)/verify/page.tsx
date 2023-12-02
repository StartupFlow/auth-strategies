import { Metadata } from "next";
import VerifyFormClient from "./components/verify-form-client";

export const metadata: Metadata = {
  title: "Code verification Page | AfricaZon",
};
const VerifyPage = () => {
  return <VerifyFormClient />;
};

export default VerifyPage;
