"use server";
import {
  VerifySchema,
  codeQueryParam,
  targetQueryParam,
  typeQueryParam,
} from "@/lib/auth.schema";
import { isCodeValid } from "@/lib/auth.server";

import prisma from "@/lib/prismadb";
import { setVerificationSessionStorage } from "@/lib/verification-storage";
import { parse } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { z } from "zod";
import { onboardingEmailSessionKey } from "./constants";

export async function validateRequest(body: FormData) {
  const submission = await parse(body, {
    schema: () =>
      VerifySchema.superRefine(async (data, ctx) => {
        const codeIsValid = await isCodeValid({
          code: data[codeQueryParam],
          type: data[typeQueryParam],
          target: data[targetQueryParam],
        });
        if (!codeIsValid) {
          ctx.addIssue({
            path: ["code"],
            code: z.ZodIssueCode.custom,
            message: `Invalid code`,
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
      message: "The code you entered is invalid.",
    } as const;
  }

  const { value: submissionValue } = submission;

  async function deleteVerification() {
    await prisma.verification.delete({
      where: {
        target_type: {
          type: submissionValue[typeQueryParam],
          target: submissionValue[targetQueryParam],
        },
      },
    });
  }

  switch (submissionValue[typeQueryParam]) {
    case "onboarding": {
      await deleteVerification();
      void setVerificationSessionStorage(
        onboardingEmailSessionKey,
        submissionValue[targetQueryParam]
      );
      return redirect("/onboarding");
    }
  }
}
