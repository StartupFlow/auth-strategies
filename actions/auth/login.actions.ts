"use server";

import {
  getSessionExpirationDate,
  verifyUserPassword,
} from "@/lib/auth.server";
import { createUserSession } from "@/lib/manage-session";
import prisma from "@/lib/prismadb";
import { LoginFormSchema } from "@/lib/user-validation";
import { parse } from "@conform-to/zod";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sessionKey } from "./constants";

export const loginAction = async (formData: FormData) => {
  const submission = await parse(formData, {
    schema: (intent) =>
      LoginFormSchema.transform(async (data, ctx) => {
        if (intent !== "submit") return { session: null };

        const session = await login(data);

        if (!session) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid username or password",
            path: ["signup-form-error"],
          });
          return z.NEVER;
        }

        return { ...data, session };
      }),

    async: true,
  });

  // get the password off the payload that's sent back
  delete submission.payload.password;

  if (submission.intent !== "submit") {
    // @ts-expect-error - conform should probably have support for doing this
    delete submission.value?.password;
    return {
      status: "idle",
      message: "Invalid username or password",
    } as const;
  }
  if (!submission.value?.session) {
    return {
      status: "error",
      message: "Invalid username or password",
    } as const;
  }

  const { session, remember, redirectTo } = submission.value;

  void createUserSession({
    name: sessionKey,
    value: session.id,
    expires: remember ? session.expirationDate : undefined,
  });

  redirect(redirectTo ?? "/");
};

const login = async ({
  username,
  password,
}: {
  username: User["username"];
  password: string;
}) => {
  const user = await verifyUserPassword({ username }, password);
  if (!user) return null;
  const session = await prisma.session.create({
    select: { id: true, expirationDate: true, userId: true },
    data: {
      expirationDate: getSessionExpirationDate(),
      userId: user.id,
    },
  });
  return session;
};
