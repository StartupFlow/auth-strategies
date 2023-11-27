import { cookies } from "next/headers";

export const setVerificationSessionStorage = (name: string, value: string) => {
  void cookies().set({
    name,
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    secure: process.env.NODE_ENV === "production",
    value,
  });
};
