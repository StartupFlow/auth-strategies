"use server";

import {
  getRedirectToUrl,
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
import { twoFAVerificationType } from "../settings/constantt";
import { sessionKey, unverified2faSessionKey } from "./constants";

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

  // determine whether the user has 2fa enabled by looking for a verification in the database
  // with the user's id and the twoFAVerificationType
  // you're going to need to update the login utility to retrieve the user's id

  // if the user has 2fa enabled, set the session.id in a verification cookie under something like
  // "unverified-session-id"
  // also set the user's "remember" preference in the verification cookie
  // use the getRedirectUrl utility to redirect the user to the verify route/

  // if the user does not have 2fa enabled, then we can follow the old logic

  const verification = await prisma.verification.findUnique({
    where: {
      target_type: {
        type: twoFAVerificationType,
        target: session.userId,
      },
    },
    select: { id: true },
  });

  const userHas2faEnabled = !!verification;

  if (userHas2faEnabled) {
    createUserSession({
      name: unverified2faSessionKey,
      value: session.id,
      expires: remember ? session.expirationDate : undefined,
    });

    const redirectUrl = getRedirectToUrl({
      type: twoFAVerificationType,
      target: session.userId,
    });
    return redirect(redirectUrl.toString());
  } else {
    void createUserSession({
      name: sessionKey,
      value: session.id,
      expires: remember ? session.expirationDate : undefined,
    });

    redirect(redirectTo ?? "/");
  }
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
