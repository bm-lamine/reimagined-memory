import VerifyEmailForm from "~/components/auth/verify-email-form";

export default function () {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p>verify email</p>
      <VerifyEmailForm />
    </div>
  );
}
