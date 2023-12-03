"use server";

import { isCodeValid, requireUserId } from "@/lib/auth.server";
import prisma from "@/lib/prismadb";
import { Verify2faSchema } from "@/lib/user-validation";
import { parse } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  twoFAVerificationType,
  twoFAVerifyVerificationType,
} from "./constantt";
export const Verify2faAction = async (formData: FormData) => {
  const userId = await requireUserId();

  if (formData.get("intent") === "cancel") {
    return redirect("/settings/profile/two-factor");
  }

  const submission = await parse(formData, {
    schema: () =>
      Verify2faSchema.superRefine(async (data, ctx) => {
        const codeIsValid = await isCodeValid({
          code: data.code ?? "",
          type: twoFAVerifyVerificationType,
          target: userId,
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

  // update the verification from the twoFAVerifyVerificationType to the twoFAVerificationType
  // set the expiresAt to null! this should never expire
  await prisma.verification.update({
    where: {
      target_type: {
        type: twoFAVerifyVerificationType,
        target: userId,
      },
    },
    data: {
      type: twoFAVerificationType,
      expiresAt: null,
    },
  });

  return {
    status: "success",
    message: "2FA has been enabled.",
  } as const;
};
