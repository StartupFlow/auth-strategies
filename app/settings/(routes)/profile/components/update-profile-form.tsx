"use client";
import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";

import { updateProfileAction } from "@/actions/settings/update-profile.actions";
import { ErrorList, Field } from "@/components/ui/form";
import { StatusButton } from "@/components/ui/status-button";
import { ProfileFormSchema } from "@/lib/user-validation";
import { User } from "@prisma/client";
import { toast } from "sonner";

type UpdateProfileProps = Pick<User, "username" | "name" | "email" | "id">;

const UpdateProfile = ({
  email,
  name = "",
  username,
  id: userId,
}: UpdateProfileProps) => {
  const [form, fields] = useForm({
    id: "edit-profile",
    constraint: getFieldsetConstraint(ProfileFormSchema),
    onValidate({ formData }) {
      return parse(formData, { schema: ProfileFormSchema });
    },
    defaultValue: {
      username,
      name,
      email,
    },
  });

  const handleSubmission = async (formData: FormData) => {
    const res = await updateProfileAction(userId, formData);
    if (res?.status === "error") {
      toast.error(res.message);
    } else {
      toast.success("Profile successfully updated");
    }
  };

  return (
    <form {...form.props} action={handleSubmission}>
      <div className="grid grid-cols-6 gap-x-10">
        <Field
          className="col-span-3"
          labelProps={{
            htmlFor: fields.username.id,
            children: "Username",
          }}
          inputProps={conform.input(fields.username)}
          errors={fields.username.errors}
        />
        <Field
          className="col-span-3"
          labelProps={{ htmlFor: fields.name.id, children: "Name" }}
          inputProps={conform.input(fields.name)}
          errors={fields.name.errors}
        />
      </div>

      <ErrorList errors={form.errors} id={form.errorId} />

      <div className="mt-3 flex justify-center">
        <StatusButton type="submit" size="lg">
          Save changes
        </StatusButton>
      </div>
    </form>
  );
};

export default UpdateProfile;
