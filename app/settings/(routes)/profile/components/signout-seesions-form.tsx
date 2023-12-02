"use client";
import { signOutSessionsAction } from "@/actions/settings/signout-sessions.actions";
import { StatusButton } from "@/components/ui/status-button";
import { useDoubleCheck } from "@/hooks/use-double-click";
import { Users } from "lucide-react";
import { toast } from "sonner";

const signOutOfSessionsActionIntent = "sign-out-of-sessions";
const SignOutOfSessionsForm = ({
  allSessions,
  userId,
}: {
  allSessions: number;
  userId: string;
}) => {
  const dc = useDoubleCheck();

  const handleSignOutSessions = async (formData: FormData) => {
    const res = await signOutSessionsAction(userId, formData);
    if (res?.status === "error") {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
  };

  const otherSessionsCount = allSessions - 1;

  return (
    <div className="inline-flex items-center">
      {otherSessionsCount ? (
        <form action={handleSignOutSessions}>
          <StatusButton
            {...dc.getButtonProps({
              type: "submit",
              name: "intent",
            })}
            variant={dc.doubleCheck ? "destructive" : "default"}
          >
            <Users className="h-4 w-4" />

            {dc.doubleCheck
              ? `Are you sure?`
              : `Sign out of ${otherSessionsCount} other sessions`}
          </StatusButton>
        </form>
      ) : (
        <>
          <Users className="h-4 w-4 mr-3" />
          This is your only session
        </>
      )}
    </div>
  );
};

export default SignOutOfSessionsForm;
