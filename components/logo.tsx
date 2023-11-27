import Image from "next/image";

import { cn, poppinsFont } from "@/lib/utils";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="hidden md:flex items-center gap-x-2">
        <Image
          src="/logo.svg"
          height="0"
          width="0"
          alt="Logo"
          className="w-[40px] h-[40px]"
        />
        <p className={cn("font-semibold", poppinsFont.className)}>AfricaZon</p>
      </div>
    </Link>
  );
};
