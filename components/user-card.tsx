import { User } from "@prisma/client";

import Image from "next/image";
import Link from "next/link";
import fallback from "../public/user.png";

type UserCardProps = Pick<User, "id" | "name" | "email" | "username"> & {
  imageId: string | null;
};
const UserCard = (user: UserCardProps) => {
  return (
    <Link
      href={`/users/${user.username}`}
      className="flex h-44 w-64 flex-col items-center justify-center rounded-lg bg-muted px-5 py-3 gap-2 hover:scale-105 transition-all duration-200 ease-in-out"
    >
      <Image
        src={fallback}
        alt={user.name ?? user.username}
        priority
        width={50}
        height={50}
        className="rounded-full"
      />
      {user.name ? (
        <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-lg">
          {user.name}
        </span>
      ) : null}
      {user.username ? (
        <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-base text-muted-foreground">
          {user.username}
        </span>
      ) : null}
    </Link>
  );
};

export default UserCard;
