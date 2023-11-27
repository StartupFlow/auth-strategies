import { clsx, type ClassValue } from "clsx";
import { Inter, Poppins } from "next/font/google";
import { twMerge } from "tailwind-merge";

export const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const interFont = Inter({ subsets: ["latin"] });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
