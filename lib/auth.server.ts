"use server";
import prisma from "@/lib/prismadb";
import { generateTOTP, verifyTOTP } from "@epic-web/totp";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";

import { sessionKey } from "@/actions/auth/constants";
import { twoFAVerifyVerificationType } from "@/actions/settings/constantt";
import { Password, User } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  VerificationTypes,
  codeQueryParam,
  redirectToQueryParam,
  targetQueryParam,
  typeQueryParam,
} from "./auth.schema";
import { ENV } from "./env";
import { getCurrentSession } from "./manage-session";

const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days
export const getSessionExpirationDate = () =>
  new Date(Date.now() + SESSION_EXPIRATION_TIME);

const getDomainUrl = () => {
  const host = headers().get("X-Forwarded-Host") ?? headers().get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
};

export const getRedirectToUrl = ({
  type,
  target,
  redirectTo,
}: {
  type: VerificationTypes;
  target: string;
  redirectTo?: string;
}) => {
  const redirectToUrl = new URL(`${getDomainUrl()}/verify`);
  redirectToUrl.searchParams.set(typeQueryParam, type);
  redirectToUrl.searchParams.set(targetQueryParam, target);
  if (redirectTo) {
    redirectToUrl.searchParams.set(redirectToQueryParam, redirectTo);
  }
  return redirectToUrl;
};

export const getSearchParam = (param: string) => {
  const refer = headers().get("referer")?.toString();
  const fallback = `${getDomainUrl()}/headers().get("next-url")`;
  const currentUrl = new URL(refer ?? fallback);
  const params = currentUrl.searchParams;
  return params.get(param);
};

export async function prepareVerification({
  period,
  type,
  target,
  redirectTo: postVerificationRedirectTo,
}: {
  period: number;
  type: VerificationTypes;
  target: string;
  redirectTo?: string;
}) {
  const verifyUrl = getRedirectToUrl({
    type,
    target,
    redirectTo: postVerificationRedirectTo,
  });
  const redirectTo = new URL(verifyUrl.toString());

  const { otp, ...verificationConfig } = generateTOTP({
    algorithm: "SHA256",
    period,
    secret: ENV.SESSION_SECRET,
  });

  const verificationData = {
    type,
    target,
    ...verificationConfig,
    expiresAt: new Date(Date.now() + verificationConfig.period * 1000),
  };
  await prisma.verification.upsert({
    where: { target_type: { target, type } },
    create: verificationData,
    update: verificationData,
  });

  // add the otp to the url we'll email the user.
  verifyUrl.searchParams.set(codeQueryParam, otp);

  return { otp, redirectTo, verifyUrl };
}

export async function isCodeValid({
  code,
  type,
  target,
}: {
  code: string;
  type: VerificationTypes | typeof twoFAVerifyVerificationType; // we are not adding this type to the valid types in general because it's a temporary type
  target: string;
}) {
  const verification = await prisma.verification.findUnique({
    where: {
      target_type: { target, type },
      OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
    },
    select: { algorithm: true, secret: true, period: true, charSet: true },
  });

  if (!verification) return false;

  const result = verifyTOTP({
    otp: code,
    secret: verification.secret,
    algorithm: verification.algorithm,
    period: verification.period,
    charSet: verification.charSet,
  });

  if (!result) return false;

  return true;
}

export async function getPasswordHash(password: string) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

export const verifyUserPassword = async (
  where: Pick<User, "username"> | Pick<User, "id">,
  password: Password["hash"]
) => {
  const userWithPassword = await prisma.user.findUnique({
    where,
    select: { id: true, password: { select: { hash: true } } },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  return { id: userWithPassword.id };
};

export async function requireUserId({
  redirectTo,
}: { redirectTo?: string | null } = {}) {
  const refer = headers().get("referer")?.toString();
  const fallback = `${getDomainUrl()}/headers().get("next-url")`;
  const currentUrl = new URL(refer ?? fallback);

  const userId = await getUserId();
  if (!userId) {
    const requestUrl = new URL(currentUrl);

    redirectTo =
      redirectTo === null
        ? null
        : redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`;
    const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null;
    const loginRedirect = ["/login", loginParams?.toString()]
      .filter(Boolean)
      .join("?");
    throw redirect(loginRedirect);
  }
  return userId;
}

export const requireUser = async () => {
  const userId = await requireUserId();
  const user = await prisma.user.findUnique({
    select: { id: true, username: true },
    where: { id: userId },
  });
  if (!user) {
    throw redirect("/");
  }
  return user;
};

export const maybeUser = async () => {
  const userId = await getUserId();
  if (!userId) {
    return null;
  }
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      image: {
        select: {
          id: true,
        },
      },
    },
    where: { id: userId },
  });
  if (!user) {
    return null;
  }

  return user;
};

export const getUserId = async () => {
  const currentSession = getCurrentSession(sessionKey);
  if (!currentSession) {
    return null;
  }
  const session = await prisma.session.findUnique({
    select: { user: { select: { id: true } } },
    where: { id: currentSession, expirationDate: { gt: new Date() } },
  });

  if (!session?.user) {
    return null;
  }
  return session.user.id;
};
export const requireAnonymous = async () => {
  const userId = await getUserId();
  if (userId) {
    return redirect("/");
  }
};
