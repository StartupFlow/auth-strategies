import { logoutAction } from "@/actions/auth/logout.actions";
import { Spacer } from "@/components/spacer";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth.server";

import prisma from "@/lib/prismadb";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import fallback from "../../../../../public/user.png";

const UserPageSchema = z.object({
  username: z.string(),
});

const UserPage = async ({
  params,
}: {
  params: {
    username: string;
  };
}) => {
  const validUsername = UserPageSchema.safeParse(params);

  if (!validUsername.success) {
    return <div>Invalid username</div>;
  }

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      username: true,
      createdAt: true,
      image: { select: { id: true } },
    },
    where: {
      username: params.username,
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const userDisplayName = user.name ?? user.username;
  const userJoinedDisplay = user.createdAt.toLocaleDateString();
  const isLoggedInUser = true;

  await requireUser();

  return (
    <div className="container items-center justify-center">
      <Spacer size="4xs" />

      <div className="container flex flex-col items-center rounded-3xl bg-muted p-12">
        <div className="relative w-52">
          <div className="absolute -top-40">
            <div className="relative">
              <Image
                alt={userDisplayName}
                src={fallback}
                height="0"
                width="0"
                priority
                className="h-52 w-52 rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        <Spacer size="sm" />
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <h1 className="text-center text-2xl capitalize">
              {userDisplayName}
            </h1>
          </div>
          <p className="mt-2 text-center text-muted-foreground">
            Joined {userJoinedDisplay}
          </p>
          {isLoggedInUser ? (
            <form action={logoutAction} className="mt-3">
              <Button type="submit" variant="link" size="pill">
                <LogOut
                  size={24}
                  aria-label="exit icon"
                  className="scale-125 max-md:scale-150"
                />
              </Button>
            </form>
          ) : null}
          <div className="mt-10 flex gap-4">
            {isLoggedInUser ? (
              <>
                <Button asChild>
                  <Link href="orders">My orders</Link>
                </Button>
                <Button asChild>
                  <Link href="/settings/profile">Edit profile</Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="notes">{userDisplayName}&apos;s notes</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
