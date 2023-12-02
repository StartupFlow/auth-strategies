"use server";
import { parse } from "@conform-to/zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { deleteSession, getCurrentSession } from "@/lib/manage-session";
import prisma from "@/lib/prismadb";
import { ResetPasswordSchema } from "@/lib/user-validation";
import { User } from "@prisma/client";
import { resetPasswordUsernameSessionKey } from "./constants";

const requireResetPasswordUsername = () => {
  const username = getCurrentSession(resetPasswordUsernameSessionKey);

  if (!username) {
    return redirect("/login");
  }
  return username;
};

export const resetPasswordAction = async (formData: FormData) => {
  const username = requireResetPasswordUsername();
  const submission = parse(formData, {
    schema: ResetPasswordSchema,
  });
  if (!submission.value?.password) {
    return {
      status: "error",
      message: "Password is required",
    } as const;
  }

  const { password } = submission.value;
  await resetUserPassword({ username, password });
  void deleteSession(resetPasswordUsernameSessionKey);
  redirect("/login");
};

const resetUserPassword = async ({
  username,
  password,
}: {
  username: User["username"];
  password: string;
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.update({
    where: { username },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
  });
};
