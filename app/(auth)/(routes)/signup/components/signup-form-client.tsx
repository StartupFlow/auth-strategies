"use client";
import { ErrorList, Field } from "@/components/ui/form";
import { StatusButton } from "@/components/ui/status-button";
import { SignUpSchema } from "@/lib/user-validation";

import { magicLinkAction } from "@/actions/auth/magic-link.actions";
import { Spacer } from "@/components/spacer";
import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const SignupFormClient = () => {
  const searchParams = useSearchParams();
  const [form, fields] = useForm({
    id: "magic-link-form",
    constraint: getFieldsetConstraint(SignUpSchema),
    onValidate({ formData }) {
      return parse(formData, { schema: SignUpSchema });
    },
    defaultValue: {
      email: "",
      redirectTo: searchParams.get("redirectTo") ?? "",
    },
    shouldRevalidate: "onBlur",
  });

  // TODO create a handleSubmission function that takes in a FormData object
  // and calls magicLinkAction with the FormData object as the argument.
  // If the response status is "error", then use toast.error to display the
  // error message.

  return (
    <div className="container flex min-h-full flex-col justify-center pb-32 pt-20">
      <div className="mx-auto w-full max-w-lg">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-3xl">Let&lsquo;s start your journey!</h1>
          <p className="text-body-md text-muted-foreground">
            Please enter your email.
          </p>
        </div>
        <Spacer size="xs" />
        <form
          // TODO add the handleSubmission function to the action prop

          className="mx-auto min-w-[368px] max-w-lg"
          {...form.props}
        >
          <Field
            labelProps={{ htmlFor: fields.email.id, children: "Email" }}
            inputProps={{
              ...conform.input(fields.email),
              autoComplete: "email",
              autoFocus: true,
            }}
            errors={fields.email.errors}
          />
          <input {...conform.input(fields.redirectTo, { type: "hidden" })} />

          <ErrorList errors={form.errors} id={form.errorId} />
          <StatusButton className="w-full">
            Continue
            <ArrowRight />
          </StatusButton>
        </form>
      </div>
    </div>
  );
};

export default SignupFormClient;
