"use client";
import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { useSearchParams } from "next/navigation";

import { Spacer } from "@/components/spacer";
import { CheckboxField, ErrorList, Field } from "@/components/ui/form";
import { StatusButton } from "@/components/ui/status-button";

import { loginAction } from "@/actions/auth/login.actions";
import { LoginFormSchema } from "@/lib/user-validation";
import {} from "@conform-to/react";
import Link from "next/link";
import { toast } from "sonner";

const LoginFormClient = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const handleSubmission = async (formData: FormData) => {
    const res = await loginAction(formData);
    if (res?.status === "error") {
      toast.error(res.message);
    } else {
      toast.success("Login successful");
    }
  };

  const [form, fields] = useForm({
    id: "signup-form",
    constraint: getFieldsetConstraint(LoginFormSchema),
    onValidate({ formData }) {
      return parse(formData, { schema: LoginFormSchema });
    },
    defaultValue: {
      username: "bakate",
      password: "tinkiete",
      redirectTo,
    },
    shouldRevalidate: "onBlur",
  });

  return (
    <div className="container pb-32 pt-20">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-3xl">Welcome back!</h1>
        <p className="text-body-md text-muted-foreground">
          Please enter your details.
        </p>
      </div>
      <Spacer size="xs" />
      <form
        action={handleSubmission}
        className="mx-auto min-w-[368px] max-w-lg"
        {...form.props}
      >
        <Field
          labelProps={{ htmlFor: fields.username.id, children: "Username" }}
          inputProps={{
            ...conform.input(fields.username),
            autoComplete: "username",
            className: "lowercase",
          }}
          errors={fields.username.errors}
        />

        <Field
          labelProps={{ htmlFor: fields.password.id, children: "Password" }}
          inputProps={{
            ...conform.input(fields.password, { type: "password" }),
          }}
          errors={fields.password.errors}
        />

        <div className="flex justify-between items">
          <CheckboxField
            labelProps={{
              htmlFor: fields.remember.id,
              children: "Remember this device for 30 days",
            }}
            buttonProps={conform.input(fields.remember, { type: "checkbox" })}
            errors={fields.remember.errors}
          />

          <Link
            href="/forgot-password"
            className="hover:underline text-body-xs font-semibold"
          >
            Forgot password?
          </Link>
        </div>

        <input {...conform.input(fields.redirectTo, { type: "hidden" })} />
        <ErrorList errors={form.errors} id={form.errorId} />
        <StatusButton className="w-full">Log In</StatusButton>
      </form>
      <div className="flex items-center justify-center gap-2 pt-6">
        <span className="text-muted-foreground">New here?</span>
        <Link
          href={
            redirectTo ? `/signup?${encodeURIComponent(redirectTo)}` : "/signup"
          }
          className="hover:underline text-body-xs font-semibold"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default LoginFormClient;
