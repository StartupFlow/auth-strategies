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

  const handleSubmission = async (formData: FormData) => {
    const res = await magicLinkAction(formData);
    if (res?.status === "error") {
      toast.error(res.message);
    }
  };
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
          action={handleSubmission}
          className="mx-auto min-w-[368px] max-w-lg"
          {...form.props}
        >
          <Field
            labelProps={{ htmlFor: fields.email.id, children: "Email" }}
            inputProps={{
              ...conform.input(fields.email),
              autoComplete: "email",
              autoFocus: true,
              className: "lowercase",
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
