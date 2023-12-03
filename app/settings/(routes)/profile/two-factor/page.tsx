import { twoFAVerificationType } from "@/actions/settings/constantt";
import { requireUserId } from "@/lib/auth.server";
import prisma from "@/lib/prismadb";
import { Check, LockKeyhole, UnlockKeyhole } from "lucide-react";
import Link from "next/link";
import Enable2faFormClient from "./components/enable-2fa-form-client";

const TwoFactorPage = async () => {
  // get the userId from the requireUserId function
  const userId = await requireUserId();
  // determine whether the user has 2fa by checking for a verification and by the type twoFAVerificationType
  // and the target being the userId
  // Set isTwoFAEnabled to true if it exists

  const result = await prisma.verification.findFirst({
    where: {
      type: twoFAVerificationType,
      target: userId,
    },
    select: {
      id: true,
    },
  });

  const isTwoFAEnabled = Boolean(result);
  return (
    <div className="flex flex-col gap-4 text-center mx-auto  max-w-2xl">
      {isTwoFAEnabled ? (
        <>
          <p className="text-2xl flex items-center">
            <Check className="h-5 w-5 mr-3"></Check>
            You have enabled two-factor authentication.
          </p>
          <Link
            className="flex items-center hover:underline hover:transition"
            href="/settings/profile/two-factor/disable"
          >
            <LockKeyhole className="h-5 w-5 mr-3" />
            Disable 2FA
          </Link>
        </>
      ) : (
        <>
          <p className="text-2xl flex items-center">
            <UnlockKeyhole className="h-5 w-5 mr-3" />
            You have not enabled two-factor authentication yet.
          </p>
          <p className="text-sm mt-1 mb-2">
            Two factor authentication adds an extra layer of security to your
            account. You will need to enter a code from your authenticator app
            like{" "}
            <a
              className="hover:underline hover:transition"
              href="https://apps.apple.com/us/app/google-authenticator/id388497605"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Authenticator{" "}
            </a>
            or{" "}
            <a
              className="hover:underline hover:transition"
              href="https://1password.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              1Password{" "}
            </a>
            to log in.
          </p>
          <Enable2faFormClient />
        </>
      )}
    </div>
  );
};

export default TwoFactorPage;
