"use client";

import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useScrollTop } from "@/hooks/use-scroll-top";

import { cn } from "@/lib/utils";

import { User } from "@prisma/client";
import Image from "next/image";
import fallback from "../public/user.png";
import { Logo } from "./logo";

type NavbarProps = {
  user:
    | (User & {
        image: {
          id: string;
        } | null;
      })
    | null;
};
export const Navbar = ({ user }: NavbarProps) => {
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        <div className="flex items-center gap-10">
          {user ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="secondary">
                <Link
                  href={`/users/${user.username}`}
                  className="flex items-center gap-2"
                >
                  <Image
                    className="h-8 w-8 rounded-full object-cover"
                    alt={user.name ?? user.username}
                    src={fallback}
                  />
                  <span className="hidden text-body-sm font-bold sm:block">
                    {user.name ?? user.username}
                  </span>
                </Link>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log In</Link>
            </Button>
          )}
        </div>

        <ModeToggle />
      </div>
    </div>
  );
};
