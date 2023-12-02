import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - AfricaZon",
  description: "Change your profile settings here.",
};

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid place-items-center min-h-[calc(100vh-85px)]">
      {children}
    </div>
  );
};

export default SettingsLayout;
