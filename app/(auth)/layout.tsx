import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup Bloomflow Workshop Account",
  description: "Setup Bloomflow Workshop Account",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid place-items-center min-h-[calc(100vh-85px)]">
      {children}
    </div>
  );
};

export default AuthLayout;
