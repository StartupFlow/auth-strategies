"use server";

import { getPasswordHash, getSessionExpirationDate } from "@/lib/auth.server";
import prisma from "@/lib/prismadb";
import { SignUpFormSchema } from "@/lib/user-validation";
import { parse } from "@conform-to/zod";
import { User } from "@prisma/client";
import { z } from "zod";

// TODO create an asynchronous requireOnboardingEmail function
// 1. get the email from the helper function getCurrentSession using the onboardingEmailSessionKey
// 2. if there is no email, redirect the user to the "/signup" page
// 3. return the email

const signupUser = async ({
  email,
  username,
  password,
  name,
}: {
  email: User["email"]; // I like to communicate to ley you know where the type is coming from. We can also just use "email: string"
  username: User["username"];
  name: User["name"];
  password: string;
}) => {
  const hashedPassword = await getPasswordHash(password);
  // wih prisma, you can create a user and a session in one query. That's awesome!
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
  const email = ""; // TODO get the email from the requireOnboardingEmail function

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

  // TODO 1. create a session for the user by using the helper function createUserSession
  //   with the following parameters:
  //   name: sessionKey
  //   value: session.id
  //   expires: remember ? session.expirationDate : undefined

  // TODO
  // 1. delete the temporary onboarding email session by using the helper function deleteSession with the following parameter: onboardingEmailSessionKey

  // TODO
  // redirect the user to the redirectTo path or "/" if redirectTo is undefined
};
