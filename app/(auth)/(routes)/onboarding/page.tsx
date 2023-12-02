import { onboardingEmailSessionKey } from "@/actions/auth/constants";
import { requireAnonymous } from "@/lib/auth.server";
import { getCurrentSession } from "@/lib/manage-session";
import { Metadata } from "next";
import OnboardingFormClient from "./components/onboarding-form-client";

export const metadata: Metadata = {
  title: "Setup a new AfricaZon Account",
};

const OnboardingPage = async () => {
  await requireAnonymous();
  const email = getCurrentSession(onboardingEmailSessionKey);
  return <OnboardingFormClient email={email} />;
};

export default OnboardingPage;
