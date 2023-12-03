import { twoFAVerifyVerificationType } from "@/actions/settings/constantt";
import { requireUserId } from "@/lib/auth.server";
import prisma from "@/lib/prismadb";
import { getTOTPAuthUri } from "@epic-web/totp";
import Image from "next/image";
import { redirect } from "next/navigation";
import * as QRCode from "qrcode";
import VerifyFormClient from "./components/verify-form-client";

const VerifyPage = async () => {
  const userId = await requireUserId();
  const verification = await prisma.verification.findUnique({
    where: {
      target_type: {
        type: twoFAVerifyVerificationType,
        target: userId,
      },
    },
    select: {
      id: true,
      algorithm: true,
      secret: true,
      period: true,
      digits: true,
    },
  });

  if (!verification) {
    throw redirect("/settings/profile/two-factor");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });

  const optUri = getTOTPAuthUri({
    ...verification,
    accountName: user.email,
    issuer: "Bloomflow Workshop",
  });

  const qrCode = await QRCode.toDataURL(optUri);

  return (
    <div className="flex w-full max-w-md flex-col justify-center gap-4">
      <Image
        alt="qr code"
        src={qrCode}
        className="h-56 w-56 mx-auto"
        height="0"
        width="0"
      />
      <p>
        Scan this QR code, you can can manually add this account to your
        authenticator app using this code:
      </p>
      <div className="p-4">
        <pre
          className="whitespace-pre-wrap break-all text-sm"
          aria-label="One-time Password URI"
        >
          {optUri}
        </pre>
      </div>
      <p>
        Once you&apos;ve added the account, enter the code from your
        authenticator app below. Once you enable 2FA, you will need to enter a
        code from your authenticator app evry time you log in or to perform
        important actions. Do not lose access to your authenticator app, or you
        will lose access to your account.
      </p>

      <VerifyFormClient />
    </div>
  );
};

export default VerifyPage;
