"use server";

import { getPasswordHash, getSessionExpirationDate } from "@/lib/auth.server";
import { createUserSession, getCurrentSession } from "@/lib/manage-session";
import prisma from "@/lib/prismadb";
import { SignUpFormSchema } from "@/lib/user-validation";
import { parse } from "@conform-to/zod";
import { User } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { onboardingEmailSessionKey, sessionKey } from "./constants";

const requireOnboardingEmail = async () => {
  const email = getCurrentSession(onboardingEmailSessionKey);

  if (!email) {
    return redirect("/signup");
  }

  return email;
};

const signupUser = async ({
  email,
  username,
  password,
  name,
}: {
  email: User["email"];
  username: User["username"];
  name: User["name"];
  password: string;
}) => {
  const hashedPassword = await getPasswordHash(password);

  return prisma.session.create({
    data: {
      expirationDate: getSessionExpirationDate(),
      user: {
        create: {
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          name,
          password: {
            create: {
              hash: hashedPassword,
            },
          },
        },
      },
    },
    select: {
      id: true,
      expirationDate: true,
    },
  });
};

export const signupAction = async (formData: FormData) => {
  const email = await requireOnboardingEmail();

  const submission = await parse(formData, {
    schema: SignUpFormSchema.superRefine(async (data, ctx) => {
      const existingUser = await prisma.user.findUnique({
        select: { id: true },
        where: { username: data.username },
      });
      if (existingUser) {
        ctx.addIssue({
          path: ["username"],
          code: "custom",
          message: "A user already exists with this username",
        });
        return z.NEVER;
      }
    }).transform(async (data) => {
      const session = await signupUser({ ...data, email });
      return { ...data, session };
    }),

    async: true,
  });

  if (submission.intent !== "submit") {
    return null;
  }

  if (!submission.value?.session) {
    return {
      status: "error",
      message: "A user already exists with this username",
    } as const;
  }

  const { session, remember, redirectTo } = submission.value;

  // 1. create a session for the user
  void createUserSession({
    name: sessionKey,
    value: session.id,
    expires: remember ? session.expirationDate : undefined,
  });

  // 2. remove the temporary onboarding cookie
  void cookies().delete(onboardingEmailSessionKey);

  // 3. redirect the user
  redirect(redirectTo ?? "/");
};
