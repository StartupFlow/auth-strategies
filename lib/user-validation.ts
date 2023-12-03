import { faker } from "@faker-js/faker";
import { z } from "zod";

export const UsernameSchema = z
  .string({ required_error: "Username is required" })
  .min(3, { message: "Username is too short" })
  .max(20, { message: "Username is too long" })
  .regex(/^[a-zA-Z0-9]+$/, {
    message: "Username can only include letters, numbers, and underscores",
  })
  // users can provide a username in any case, but we store it in lowercase
  .transform((value) => value.toLowerCase());

export const PasswordSchema = z
  .string({
    required_error: "Password is required",
  })
  .min(6, {
    message: "Password is too short",
  })
  .max(100, {
    message: "Password is too long",
  });

export const EmailSchema = z
  .string({
    required_error: "Email is required",
  })
  .email({ message: "Invalid email" })
  .min(3, {
    message: "Email is too short",
  })
  .max(100, {
    message: "Email is too long",
  })
  // users can provide an email in any case, but we store it in lowercase
  .transform((value) => value.toLowerCase());

export const NameSchema = z
  .string({
    required_error: "Name is required",
  })
  .min(2, {
    message: "Name is too short",
  })
  .max(40, {
    message: "Name is too long",
  });

export const SignUpFormSchema = z
  .object({
    username: UsernameSchema,
    name: NameSchema,
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
    agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
      required_error:
        "You must agree to the terms of service and privacy policy",
    }),
    remember: z.boolean().optional(),
    redirectTo: z.string().optional(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "The passwords must match",
      });
    }
  });

const fakeUsername = faker.person.firstName("male").toLowerCase();

export const SignUpFormDefaultValues = {
  username: fakeUsername,
  name: faker.person.firstName("male"),
  password: fakeUsername,
  confirmPassword: fakeUsername,
};

export const SignUpSchema = z.object({
  email: EmailSchema,
  redirectTo: z.string().optional(),
});

export const LoginFormSchema = z.object({
  username: UsernameSchema,
  password: PasswordSchema,
  redirectTo: z.string().optional(),
  remember: z.boolean().optional(),
});

export const ForgotPasswordSchema = z.object({
  usernameOrEmail: z.union([EmailSchema, UsernameSchema]),
});

export const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine(({ confirmPassword, password }) => password === confirmPassword, {
    message: "The passwords did not match",
    path: ["confirmPassword"],
  });

export const ProfileFormSchema = z.object({
  name: NameSchema.optional(),
  username: UsernameSchema,
});

export const UserSearchSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  image: z
    .object({
      id: z.string(),
    })
    .nullable()
    .optional(),
});

export const Verify2faSchema = z.object({
  code: z.string().min(6).max(6).optional(),
});
