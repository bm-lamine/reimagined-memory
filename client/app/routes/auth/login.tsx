import LoginForm from "~/components/auth/login-form";

export default function () {
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
      <p>login page</p>
      <LoginForm />
    </div>
  );
}
