import RegisterForm from "~/components/auth/register-form";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p>register page</p>

      {/* Register Form */}
      <RegisterForm />
    </div>
  );
}
