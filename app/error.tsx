"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/error.png"
        height="300"
        width="300"
        priority
        alt="Error"
        className="dark:hidden w-auto h-auto"
      />
      <Image
        src="/error-dark.png"
        height="300"
        width="300"
        priority
        alt="Error"
        className="hidden dark:block w-auto h-auto"
      />
      <h2 className="text-xl font-medium">Something went wrong.</h2>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
