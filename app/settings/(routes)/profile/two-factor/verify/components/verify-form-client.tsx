"use client";
import { Verify2faAction } from "@/actions/settings/verify-2fa.actions";
import { Field } from "@/components/ui/form";
import { StatusButton } from "@/components/ui/status-button";
import { Verify2faSchema } from "@/lib/user-validation";
import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const VerifyFormClient = () => {
  const [form, fields] = useForm({
    id: "verify-2fa-form",
    constraint: getFieldsetConstraint(Verify2faSchema),
    onValidate({ formData }) {
      return parse(formData, { schema: Verify2faSchema });
    },
    shouldRevalidate: "onInput",
  });

  const handleSubmission = async (formData: FormData) => {
    const response = await Verify2faAction(formData);
    if (response?.status === "error") {
      toast.error(response.message);
    }
    if (response?.status === "success") {
      toast.success(response.message);
      redirect("/settings/profile/two-factor");
    }
  };
  return (
    <div className="flex w-full max-w-md flex-col justify-center gap-4">
      <form {...form.props} className="flex-1" action={handleSubmission}>
        <Field
          labelProps={{
            htmlFor: fields.code.id,
            children: "Code",
          }}
          inputProps={{ ...conform.input(fields.code), autoFocus: true }}
          errors={fields.code.errors}
        />

        <div className="flex justify-between gap-4">
          <StatusButton
            className="w-full"
            type="submit"
            name="intent"
            variant={"secondary"}
            value="cancel"
          >
            Cancel
          </StatusButton>
          <StatusButton
            className="w-full"
            type="submit"
            name="intent"
            value="verify"
          >
            Submit
          </StatusButton>
        </div>
      </form>
    </div>
  );
};

export default VerifyFormClient;
