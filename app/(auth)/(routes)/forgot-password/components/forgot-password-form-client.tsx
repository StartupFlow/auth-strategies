"use client";
import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";

import { forgotPasswordAction } from "@/actions/auth/forgot-password.actions";
import { Spacer } from "@/components/spacer";
import { ErrorList, Field } from "@/components/ui/form";
import { StatusButton } from "@/components/ui/status-button";
import { ForgotPasswordSchema } from "@/lib/user-validation";
import Link from "next/link";
import { toast } from "sonner";

const ForgotPasswordFormClient = () => {
  const handleSubmission = async (formData: FormData) => {
    const res = await forgotPasswordAction(formData);
    if (res?.status === "error") {
      toast.error(res.message);
    } else {
      toast.success("Password reset instructions sent");
    }
  };

  const [form, fields] = useForm({
    id: "forgot-password-form",
    constraint: getFieldsetConstraint(ForgotPasswordSchema),
    onValidate({ formData }) {
      return parse(formData, { schema: ForgotPasswordSchema });
    },
    shouldRevalidate: "onBlur",
  });

  return (
    <div className="container pb-32 pt-20">
      <div className="flex flex-col justify-center">
        <div className="text-center">
          <h1 className="text-3xl">Forgot Password</h1>
          <p className="mt-3 text-body-md text-muted-foreground">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>
        <Spacer size="xs" />

        <form
          {...form.props}
          className="mx-auto min-w-[368px] max-w-lg"
          action={handleSubmission}
        >
          <div>
            <Field
              labelProps={{
                htmlFor: fields.usernameOrEmail.id,
                children: "Username or Email",
              }}
              inputProps={{
                autoFocus: true,
                ...conform.input(fields.usernameOrEmail),
              }}
              errors={fields.usernameOrEmail.errors}
            />
          </div>
          <ErrorList errors={form.errors} id={form.errorId} />

          <div className="mt-6">
            <StatusButton className="w-full" type="submit">
              Recover password
            </StatusButton>
          </div>
        </form>
        <Link
          href="/login"
          className="mt-11 text-center text-body-sm font-bold"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordFormClient;
