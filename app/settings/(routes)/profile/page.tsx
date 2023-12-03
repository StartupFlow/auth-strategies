import { twoFAVerificationType } from "@/actions/settings/constantt";
import { Button } from "@/components/ui/button";
import { requireUserId } from "@/lib/auth.server";
import prisma from "@/lib/prismadb";
import {
  Camera,
  KeyRound,
  LockKeyhole,
  Mail,
  UnlockKeyhole,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import fallback from "../../../../public/user.png";
import SignOutOfSessionsForm from "./components/signout-seesions-form";
import UpdateProfile from "./components/update-profile-form";

const EditUserProfile = async () => {
  const userId = await requireUserId();
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      username: true,
      email: true,
      name: true,
      id: true,
      image: {
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          sessions: true,
        },
      },
    },
  });

  const sessions = user._count.sessions;

  // determine whether the user has 2fa by checking for a verification and by the type twoFAVerificationType
  // and the target being the userId
  // Set isTwoFAEnabled to true if it exists

  const result = await prisma.verification.findFirst({
    where: {
      type: twoFAVerificationType,
      target: userId,
    },
    select: {
      id: true,
    },
  });

  const isTwoFAEnabled = Boolean(result);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center">
        <div className="relative h-52 w-52">
          <Image
            src={fallback}
            alt={user.username}
            className="h-full w-full rounded-full object-cover"
          />
          <Button
            asChild
            variant="outline"
            className="absolute -right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full p-0"
          >
            <Link
              href="photo"
              title="Change profile photo"
              aria-label="Change profile photo"
            >
              <Camera className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <UpdateProfile {...user} />

      <div className="col-span-6 my-6 h-1 border-b-[1.5px] border-foreground" />
      <div className="col-span-full flex flex-col gap-6">
        <div>
          <Link href="change-email" className="flex items-center">
            <Mail className="h-4 w-4 mr-3" />
            Change email from{" "}
            <b className="hover:underline ml-1">{user.email}</b>
          </Link>
        </div>
        <div>
          <Link href="profile/two-factor" className="flex items-center">
            {isTwoFAEnabled ? (
              <>
                <LockKeyhole className="h-4 w-4 mr-3" />
                ZFA is enabled
              </>
            ) : (
              <>
                <UnlockKeyhole className="h-4 w-4 mr-3" />
                Enable 2FA
              </>
            )}
          </Link>
        </div>
        <div>
          <Link href="password" className="flex items-center">
            <KeyRound className="h-4 w-4 mr-3" />
            Change Password
          </Link>
        </div>
        <SignOutOfSessionsForm allSessions={sessions} userId={user.id} />
      </div>
    </div>
  );
};

export default EditUserProfile;
