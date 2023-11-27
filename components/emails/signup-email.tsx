import * as E from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
export default function SignupEmail({
  onboardingUrl,
  otp,
  otpExpirationTime,
}: {
  onboardingUrl?: string;
  otp?: string;
  otpExpirationTime?: number;
}) {
  return (
    <Tailwind>
      <E.Html lang="en" dir="ltr">
        <E.Preview>Your login code for Bloomflow Workfshop</E.Preview>
        <E.Body className="bg-gray-50 text-slate-900">
          <E.Container className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-white shadow-md rounded-lg">
            <E.Heading className="text-center text-2xl font-bold">
              Complete your login to Bloomflow Workfshop
            </E.Heading>

            <p className="text-gray-700 text-lg line-height-6">
              <E.Text>
                A unique login code has been sent to you. Click the link below
                to complete your login and start exploring Bloomflow
                Workfshop&apos;s vast selection of products and services.
              </E.Text>
            </p>
            <E.Button
              className="inline-block py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-700"
              href={onboardingUrl}
            >
              Complete your login
            </E.Button>
            <p className="mt-3 text-gray-700 text-lg line-height-6">
              <E.Text>
                This code will expire in {otpExpirationTime} minutes. Please
                enter it before it expires.
              </E.Text>
            </p>
            <p className="mt-3 text-gray-700 text-lg line-height-6">
              <E.Text>
                If you did not request this code, please disregard this email.
              </E.Text>
            </p>
            <p className="mt-3 text-gray-700 text-lg line-height-6">
              <E.Text>
                Thank you for using Bloomflow Workfshop. We&apos;re excited to
                have you onboard!
              </E.Text>
            </p>
          </E.Container>
        </E.Body>
      </E.Html>
    </Tailwind>
  );
}
