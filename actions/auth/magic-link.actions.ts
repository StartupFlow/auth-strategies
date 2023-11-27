"use server";
import { parse } from "@conform-to/zod";
import { redirect } from "next/navigation";
import React from "react";
import { z } from "zod";

import SignupEmail from "@/components/emails/signup-email";
import { prepareVerification } from "@/lib/auth.server";
import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prismadb";
import { SignUpSchema } from "@/lib/user-validation";
import { startAndStopMockedServer } from "@/mocks";

export const magicLinkAction = async (formData: FormData) => {
  startAndStopMockedServer();

  const submission = await parse(formData, {
    schema: SignUpSchema.superRefine(async (data, ctx) => {
      const existingUser = await prisma.user.findUnique({
        select: { id: true },
        where: { email: data.email },
      });

      if (existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "A user already exists with this email",
        });
        return z.NEVER;
      }
    }),
    async: true,
  });

  if (submission.intent !== "submit") {
    return null;
  }
  if (!submission.value) {
    return {
      status: "error",
      message: "A user already exists with this email",
    } as const;
  }

  const { email, redirectTo: postVerificationRedirectTo } = submission.value;

  const { otp, verifyUrl, redirectTo } = await prepareVerification({
    period: 10 * 60,
    type: "onboarding",
    target: email,
    redirectTo: postVerificationRedirectTo,
  });

  const response = await sendEmail({
    to: email,
    subject: `Welcome to Bloomflow Workshop!`,
    react: React.createElement(SignupEmail, {
      onboardingUrl: verifyUrl.toString(),
      otp,
    }),
  });

  if (response.status === "success") {
    return redirect(redirectTo.toString());
  } else {
    return {
      status: "error",
      message: "Error while sending email",
    } as const;
  }
};
