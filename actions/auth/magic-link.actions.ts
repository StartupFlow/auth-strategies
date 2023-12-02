"use server";
import { parse } from "@conform-to/zod";
import { z } from "zod";

import { redirect } from "next/navigation";
import React from "react";

import SignupEmail from "@/components/emails/signup-email";
import { prepareVerification } from "@/lib/auth.server";
import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prismadb";
import { SignUpSchema } from "@/lib/user-validation";
import { startAndStopMockedServer } from "@/mocks";

export const magicLinkAction = async (formData: FormData) => {
  // TODO import { startAndStopMockedServer } from "@/mocks" to intercept the request

  const submission = await parse(formData, {
    schema: SignUpSchema.superRefine(async (data, ctx) => {
      // we need to check if the user already exists
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
    // this is very helpful since in the client-side, we know exactly what we are dealing with
    return {
      status: "error",
      message: "A user already exists with this email",
    } as const;
  }

  const { email, redirectTo: postVerificationRedirectTo } = submission.value;

  // TODO import prepareVerification from "@/lib/auth" to generate the One Time Password
  // Set the period to 10 minutes (10 * 60)
  // Set the type to "onboarding"
  // Set the target to the email
  // Set the redirectTo to postVerificationRedirectTo

  const response = await sendEmail({
    to: email,
    subject: `Welcome to Bloomflow Workshop!`,
    text: `Here is your One time Password ${otp}`,
    html: `
      <div>
        <p>Hi there!</p>
        <p>
          You are receiving this email because you (or someone else) has requested to sign up for Bloomflow Workshop.
        </p>
        <p>
          Please click the link below to verify your email address and complete your signup process.
        </p>
        <p>
          <a href="${verifyUrl}">Verify your email address</a>
        </p>

        <p>
          If you did not request to sign up for Bloomflow Workshop, you can safely ignore this email.
        </p>
        <p>
          Thanks,
        </p>
        <p>
          The Bloomflow Workshop Team
        </p>
      </div>
    `,
  });

  // OR if you want to send real emails with "resend"
  // react: React.createElement(SignupEmail, {
  //   onboardingUrl: verifyUrl.toString(),
  //   otp,
  // }),

  // TODO uncomment the following line to redirect the user
  if (response.status === "success") {
    return redirect(redirectTo.toString());
  } else {
    return {
      status: "error",
      message: "Error while sending email",
    } as const;
  }
};
