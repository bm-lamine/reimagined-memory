import baseSchema from "@enjoy/schema/auth/base.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Button } from "../ui/button";
import { $fetch } from "~/utils/$fetch";
import { assignFormErrors } from "~/lib/assign-form-errors";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { authStore } from "~/store/auth";
import { useStore } from "zustand";

export default function () {
  const navigate = useNavigate();
  const { login } = useStore(authStore);
  const form = useForm({ resolver: zodResolver(baseSchema.login) });

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(values);
    const { data, error } = await $fetch<{
      accessToken?: string;
      refreshToken?: string;
      message: string;
      next: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (error || !data) {
      assignFormErrors(error.errors, form);
      return;
    } else if (data.accessToken && data.refreshToken) {
      login(data.accessToken, data.refreshToken);
    }

    localStorage.setItem("email", values.email);
    toast.success(data.message);
    navigate(data.next);
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
