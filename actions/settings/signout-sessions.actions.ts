"use server";

import { getCurrentSession } from "@/lib/manage-session";
import prisma from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { sessionKey } from "../auth/constants";

export const signOutSessionsAction = async (
  userId: string,
  _formData: FormData
) => {
  const sessionId = getCurrentSession(sessionKey);

  if (!sessionId) {
    return {
      status: "error",
      message: "You must be authenticated to sign out of other sessions",
    } as const;
  }

  await prisma.session.deleteMany({
    where: {
      userId,
      id: {
        not: sessionId,
      },
    },
  });
  revalidatePath("/settings/profile");
  return {
    status: "success",
    message: "All other sessions have been signed out",
  };
};
