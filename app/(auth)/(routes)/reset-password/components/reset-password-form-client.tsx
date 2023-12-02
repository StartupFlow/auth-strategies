"use client";
import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";

import { ErrorList, Field } from "@/components/ui/form";
import { StatusButton } from "@/components/ui/status-button";
import { ResetPasswordSchema } from "@/lib/user-validation";
import { resetPasswordAction } from "@/actions/auth/reset-password.actions";
import { toast } from "sonner";

const ResetPasswordFormClient = ({
  resetPasswordUsername,
}: {
  resetPasswordUsername: string;
}) => {
  const [form, fields] = useForm({
    id: "forgot-password-form",
    constraint: getFieldsetConstraint(ResetPasswordSchema),
    onValidate({ formData }) {
      return parse(formData, { schema: ResetPasswordSchema });
    },
    shouldRevalidate: "onBlur",
  });

  const handleSubmission = async (formData: FormData) => {
    const res = await resetPasswordAction(formData);
    if (res?.status === "error") {
      toast.error(res.message);
    } else {
      toast.success("Password reset successful");
    }
  };
  return (
    <div className="container pb-32 pt-20">
      <div className="text-center">
        <h1 className="text-3xl">Password Reset</h1>
        <p className="mt-3 text-body-md text-muted-foreground">
          Hi {resetPasswordUsername}. No worries. It happens all the time.
        </p>
      </div>
      <form
        {...form.props}
        className="mx-auto mt-8 min-w-[368px] max-w-md"
        action={handleSubmission}
      >
        <Field
          labelProps={{
            htmlFor: fields.password.id,
            children: "New Password",
          }}
          inputProps={{
            ...conform.input(fields.password, { type: "password" }),
            autoComplete: "new-password",
            autoFocus: true,
          }}
          errors={fields.password.errors}
        />
        <Field
          labelProps={{
            htmlFor: fields.confirmPassword.id,
            children: "Confirm Password",
          }}
          inputProps={{
            ...conform.input(fields.confirmPassword, { type: "password" }),
            autoComplete: "new-password",
          }}
          errors={fields.confirmPassword.errors}
        />

        <ErrorList errors={form.errors} id={form.errorId} />

        <StatusButton className="w-full" type="submit">
          Reset password
        </StatusButton>
      </form>
    </div>
  );
};

export default ResetPasswordFormClient;
