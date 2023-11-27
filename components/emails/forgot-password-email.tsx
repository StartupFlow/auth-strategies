import * as E from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
export default function ForgotPasswordEmail({
  username,
  onboardingUrl,
  otpExpirationTime,
  otp,
}: {
  username: string;
  onboardingUrl: string;
  otp: string;
  otpExpirationTime: number;
}) {
  return (
    <Tailwind>
      <E.Html lang="en" dir="ltr">
        <E.Preview>Reset your password for AfricaZon, {username} </E.Preview>
        <E.Body className="bg-gray-100 text-slate-900">
          <E.Container className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-white shadow-md rounded-lg">
            <E.Heading className="text-center text-2xl font-bold">
              AfricaZon Password Reset
            </E.Heading>
            <p>
              <E.Text className="text-gray-700 text-lg line-height-6">
                We&apos;ve received a request to reset your password. To
                complete the process, please enter the following verification
                code:
                <code className="p-4 bg-gray-200 rounded-md">{otp}</code>
              </E.Text>
            </p>
            <p>
              <E.Text className="text-gray-700 text-lg line-height-6">
                This code will expire in {otpExpirationTime} minutes. Please
                enter it before it expires.
              </E.Text>
            </p>
            <p>
              <E.Text className="text-gray-700 text-lg line-height-6">
                Or click the link to reset your password directly:
              </E.Text>
            </p>
            <E.Button
              className="inline-block py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-700"
              href={onboardingUrl}
            >
              Reset Password
            </E.Button>

            <p>
              <E.Text className="mt-3 text-gray-700 text-lg line-height-6">
                If you did not request this code, please disregard this email.
              </E.Text>
            </p>

            <p>
              <E.Text className="mt-3 text-gray-700 text-lg line-height-6">
                Thank you for using AfricaZon. We&apos;re looking forward to
                seeing you soon!
              </E.Text>
            </p>
          </E.Container>
        </E.Body>
      </E.Html>
    </Tailwind>
  );
}
