import baseSchema from "@enjoy/schema/auth/base.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useStore } from "zustand";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { assignFormErrors } from "~/lib/assign-form-errors";
import { authStore } from "~/stores/auth";
import { $fetch } from "~/utils/$fetch";

export default function () {
  const navigate = useNavigate();
  const { setToken } = useStore(authStore);
  const form = useForm({ resolver: zodResolver(baseSchema.login) });

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(values);
    const { data, error } = await $fetch<{
      emailVerified: boolean;
      message: string;
      next: string;
      token?: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (error || !data) {
      assignFormErrors(error.errors, form);
      return;
    } else if (!data.emailVerified && !data.token) {
      toast.error("Email not verified");
      navigate(data.next);
      return;
    } else if (data.emailVerified && data.token) {
      toast.success(data.message);
      setToken(data.token);
      navigate(data.next);
      return;
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>email</label>
        <Input {...form.register("email")} />
        {form.formState.errors.email && (
          <p>{form.formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <label>password</label>
        <Input {...form.register("password")} />
        {form.formState.errors.password && (
          <p>{form.formState.errors.password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
