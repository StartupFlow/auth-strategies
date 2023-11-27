"use client";
import * as React from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Spinner } from "../spinner";
import { Button, ButtonProps } from "./button";

export const StatusButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    message?: string | null;
  }
>(({ message, className, children, ...props }, ref) => {
  const { pending } = useFormStatus();

  return (
    <Button
      ref={ref}
      className={cn("flex justify-center gap-4", className)}
      {...props}
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {children}
      {pending ? <Spinner size={"lg"} /> : null}
    </Button>
  );
});
StatusButton.displayName = "Button";
