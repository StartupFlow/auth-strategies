"use client";
import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { useSearchParams } from "next/navigation";

import { signupAction } from "@/actions/auth/signup.actions";
import { Spacer } from "@/components/spacer";
import { CheckboxField, ErrorList, Field } from "@/components/ui/form";
import { StatusButton } from "@/components/ui/status-button";
import {
  SignUpFormDefaultValues,
  SignUpFormSchema,
} from "@/lib/user-validation";
import { toast } from "sonner";

type OnboardingFormClientProps = {
  email: string | undefined;
};
const OnboardingFormClient = ({ email }: OnboardingFormClientProps) => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [form, fields] = useForm({
    id: "signup-form",
    constraint: getFieldsetConstraint(SignUpFormSchema),
    onValidate({ formData }) {
      return parse(formData, { schema: SignUpFormSchema });
    },
    defaultValue: { ...SignUpFormDefaultValues, redirectTo },
    shouldRevalidate: "onBlur",
  });

  const handleSubmission = async (formData: FormData) => {
    const res = await signupAction(formData);
    if (res?.status === "error") {
      toast.error(res.message);
    } else {
      toast.success("Account successfully created");
    }
  };
  return (
    <div className="container pb-32 pt-20">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-3xl">Welcome aboard {email}!</h1>
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
          labelProps={{ htmlFor: fields.name.id, children: "Name" }}
          inputProps={{
            ...conform.input(fields.name),
            autoFocus: true,
            autoComplete: "name",
          }}
          errors={fields.name.errors}
        />
        <Field
          labelProps={{ htmlFor: fields.password.id, children: "Password" }}
          inputProps={{
            ...conform.input(fields.password, { type: "password" }),
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
          }}
          errors={fields.confirmPassword.errors}
        />

        <CheckboxField
          labelProps={{
            htmlFor: fields.agreeToTermsOfServiceAndPrivacyPolicy.id,
            children:
              "Do you agree to our Terms of Service and Privacy Policy?",
          }}
          buttonProps={conform.input(
            fields.agreeToTermsOfServiceAndPrivacyPolicy,
            { type: "checkbox" }
          )}
          errors={fields.agreeToTermsOfServiceAndPrivacyPolicy.errors}
        />
        <CheckboxField
          labelProps={{
            htmlFor: fields.remember.id,
            children: "Remember this device for 30 days",
          }}
          buttonProps={conform.input(fields.remember, { type: "checkbox" })}
          errors={fields.remember.errors}
        />

        <input {...conform.input(fields.redirectTo, { type: "hidden" })} />
        <ErrorList errors={form.errors} id={form.errorId} />
        <StatusButton className="w-full">Create an account</StatusButton>
      </form>
    </div>
  );
};

export default OnboardingFormClient;
