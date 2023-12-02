import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community - AfricaZon",
  description:
    "Each user has a profile page where they can view their orders and edit their profile.",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid place-items-center min-h-[calc(100vh-85px)]">
      {children}
    </div>
  );
};

export default AuthLayout;
