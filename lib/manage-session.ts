import { cookies } from "next/headers";

type CreateUserSessionOptions = {
  name: string;
  value: string;
  expires?: Date;
};
export const createUserSession = ({
  name,
  value,
  expires = undefined,
}: CreateUserSessionOptions) => {
  void cookies().set({
    name,
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    expires,
    secure: process.env.NODE_ENV === "production",
    value,
  });
};

export const deleteSession = async (name: string) => {
  void cookies().delete(name);
};

export const getCurrentSession = (name: string) => {
  const session = cookies().get(name);
  return session ? session.value : "";
};
