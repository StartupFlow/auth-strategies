"use server";

import { parse } from "@conform-to/zod";

import { prepareVerification } from "@/lib/auth.server";
import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prismadb";
import { ForgotPasswordSchema } from "@/lib/user-validation";
import { redirect } from "next/navigation";

export const forgotPasswordAction = async (formData: FormData) => {
  const submission = await parse(formData, {
    schema: ForgotPasswordSchema.superRefine(async (data, ctx) => {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.usernameOrEmail },
            { username: data.usernameOrEmail },
          ],
        },
        select: { id: true },
      });
      if (!user) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid username or email",
          path: ["usernameOrEmail"],
        });
        return;
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
      message: "We couldn't find an account with that username or email",
    } as const;
  }

  const { usernameOrEmail } = submission.value;

  const user = await prisma.user.findFirstOrThrow({
    where: { OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }] },
    select: { email: true, username: true },
  });

  const { verifyUrl, redirectTo, otp } = await prepareVerification({
    period: 10 * 60,
    type: "reset-password",
    target: usernameOrEmail,
  });

  const response = await sendEmail({
    to: user.email,
    subject: `Reset your password for Bloomflow Workshop, ${user.username}`,
    text: `Reset your password for Bloomflow Workshop, ${user.username}`,
    html: `
  <h4> Bloomflow Workshop Password Reset</h4>
  <p>   We&apos;ve received a request to reset your password. To
  complete the process, please enter the following verification
  code: <strong>${otp}</strong> at the following link: <a
  href="${verifyUrl}">${verifyUrl}</a></p>
  <p>If you did not request a password reset, please ignore this
  email or contact support at <a
  href="mailto:cartamn@bloomflow.com"
  >
  </p>
  <p>Thanks, <br /> The Bloomflow Workshop Team</p>
  `,
  });

  // react: React.createElement(ForgotPasswordEmail, {
  //   username: user.username,
  //   onboardingUrl: verifyUrl.toString(),
  //   otpExpirationTime: 10,
  //   otp,
  // }),
  if (response.status === "success") {
    return redirect(redirectTo.toString());
  } else {
    return {
      status: "error",
      message: "Something went wrong. We couldn't send you an email",
    } as const;
  }
};
