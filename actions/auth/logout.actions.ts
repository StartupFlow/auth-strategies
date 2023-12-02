"use server";

import { deleteSession, getCurrentSession } from "@/lib/manage-session";
import prisma from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { sessionKey } from "./constants";

export const logoutAction = async () => {
  const redirectTo = "/";
  const currentSession = getCurrentSession(sessionKey);
  if (!currentSession) {
    return redirect(redirectTo);
  }

  await prisma.session.deleteMany({
    where: { id: currentSession },
  });

  deleteSession(sessionKey);
  return redirect(redirectTo);
};
