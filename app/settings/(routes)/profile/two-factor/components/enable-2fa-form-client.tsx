"use client";

import { enable2faAction } from "@/actions/settings/enable-2fa.actions";
import { StatusButton } from "@/components/ui/status-button";

const Enable2faFormClient = () => {
  return (
    <form action={enable2faAction} className="mx-auto">
      <StatusButton type="submit" name="intent" value="enable">
        Enable 2FA
      </StatusButton>
    </form>
  );
};

export default Enable2faFormClient;
