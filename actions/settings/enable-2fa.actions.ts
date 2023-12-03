"use server";

import { requireUserId } from "@/lib/auth.server";
import { generateTOTP } from "@epic-web/totp";

import prisma from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { twoFAVerifyVerificationType } from "./constantt";

export const enable2faAction = async () => {
  const userId = await requireUserId();
  const { otp: _otp, ...config } = generateTOTP();

  const verificationData = {
    ...config,
    type: twoFAVerifyVerificationType,
    target: userId,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  };

  await prisma.verification.upsert({
    where: {
      target_type: { target: userId, type: twoFAVerifyVerificationType },
    },
    create: verificationData,
    update: verificationData,
  });
  return redirect("/settings/profile/two-factor/verify");
};
