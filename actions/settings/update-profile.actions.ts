"use server";

import prisma from "@/lib/prismadb";
import { ProfileFormSchema } from "@/lib/user-validation";
import { NextResponse } from "next/server";

import { parse } from "@conform-to/zod";
import { z } from "zod";

export const updateProfileAction = async (
  userId: string,
  formData: FormData
) => {
  const submission = await parse(formData, {
    async: true,
    schema: ProfileFormSchema.superRefine(async ({ username }, ctx) => {
      const existingUser = await prisma.user.findFirst({
        where: { username },
        select: { id: true },
      });

      if (existingUser && existingUser.id !== userId) {
        ctx.addIssue({
          code: "custom",
          message: "Username already exists",
          path: ["username"],
        });
        return z.NEVER;
      }
    }),
  });

  if (submission.intent !== "submit") {
    return null;
  }
  if (!submission.value) {
    return {
      status: "error",
      message: "The username you entered is already taken",
    } as const;
  }
  const data = submission.value;

  await prisma.user.update({
    select: { username: true },
    where: { id: userId },
    data: {
      username: data.username,
      name: data.name,
    },
  });
};
