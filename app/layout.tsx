import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { maybeUser } from "@/lib/auth.server";
import { cn, interFont } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloomflow Workshop",
  description: "Bloomflow Workshop",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await maybeUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex flex-col min-h-full justify-between",
          interFont.className
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Toaster position="bottom-right" closeButton richColors />
          <Navbar user={user} />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
