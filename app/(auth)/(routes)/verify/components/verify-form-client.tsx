"use client";

import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { useSearchParams } from "next/navigation";

import { validateRequest } from "@/actions/auth/verify.actions";
import { Spacer } from "@/components/spacer";
import { ErrorList, Field } from "@/components/ui/form";
import { StatusButton } from "@/components/ui/status-button";
import {
  VerificationTypeSchema,
  VerificationTypes,
  VerifySchema,
  codeQueryParam,
  redirectToQueryParam,
  targetQueryParam,
  typeQueryParam,
} from "@/lib/auth.schema";
import { toast } from "sonner";
import { CheckCheck } from "lucide-react";

const VerifyFormClient = () => {
  const searchParams = useSearchParams();
  const type = VerificationTypeSchema.parse(searchParams.get(typeQueryParam));
  const checkEmail = (
    <>
      <h1 className="text-h1">Check your email</h1>
      <p className="mt-3 text-body-md text-muted-foreground">
        We&lsquo;ve sent you a code to verify your email address.
      </p>
    </>
  );
  const headings: Record<VerificationTypes, React.ReactNode> = {
    onboarding: checkEmail,
    "reset-password": checkEmail,
    "2fa": "Coucou",
  };

  const [form, fields] = useForm({
    id: "verify-form",
    constraint: getFieldsetConstraint(VerifySchema),
    onValidate({ formData }) {
      return parse(formData, { schema: VerifySchema });
    },
    defaultValue: {
      code: searchParams.get(codeQueryParam) ?? "",
      type: searchParams.get(typeQueryParam) ?? "",
      target: searchParams.get(targetQueryParam) ?? "",
      redirectTo: searchParams.get(redirectToQueryParam) ?? "",
    },
    shouldRevalidate: "onBlur",
  });

  const handleSubmission = async (formData: FormData) => {
    const res = await validateRequest(formData);
    if (res?.status === "error") {
      toast.error(res.message);
    }
  };
  return (
    <div className="container flex flex-col justify-center pb-32 pt-20">
      <div className="text-center">{headings[type]}</div>

      <Spacer size="xs" />

      <div className="mx-auto flex w-72 max-w-full flex-col justify-center gap-1">
        <div>
          <ErrorList errors={form.errors} id={form.errorId} />
        </div>
        <div className="flex w-full gap-2">
          <form {...form.props} action={handleSubmission} className="flex-1">
            <Field
              labelProps={{
                htmlFor: fields[codeQueryParam].id,
                children: "Code",
              }}
              inputProps={conform.input(fields[codeQueryParam])}
              errors={fields[codeQueryParam].errors}
            />
            <input
              {...conform.input(fields[typeQueryParam], { type: "hidden" })}
            />
            <input
              {...conform.input(fields[targetQueryParam], { type: "hidden" })}
            />
            <input
              {...conform.input(fields[redirectToQueryParam], {
                type: "hidden",
              })}
            />
            <StatusButton className="w-full" type="submit">
              Submit
            </StatusButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyFormClient;
