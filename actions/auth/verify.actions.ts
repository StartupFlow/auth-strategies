"use server";
import {
  VerifySchema,
  codeQueryParam,
  targetQueryParam,
  typeQueryParam,
} from "@/lib/auth.schema";
import { isCodeValid } from "@/lib/auth.server";

import { deleteSession } from "@/lib/manage-session";
import prisma from "@/lib/prismadb";
import { setVerificationSessionStorage } from "@/lib/verification-storage";
import { parse } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  onboardingEmailSessionKey,
  resetPasswordUsernameSessionKey,
  sessionKey,
} from "./constants";

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

  // TODO create a deleteVerification function
  // it should delete the verification for the given target and type
  // since target and type are unique, you can use the constraint "target_type" to find the verification
  // try to de explicit by using typeQueryParam and targetQueryParam

  switch (submissionValue[typeQueryParam]) {
    case "onboarding": {
      // TDDO uncomment this after creating deleteVerification function
      // 1. await deleteVerification();
      // 2. import setVerificationSessionStorage from "@/lib/verification-storage" and it takes two arguments
      // the first should be onboardingEmailSessionKey and the second should be submissionValue[targetQueryParam]
      // 3. return redirect to "/onboarding" page
    }
  }
}
