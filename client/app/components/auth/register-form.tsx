import baseSchema from "@enjoy/schema/auth/base.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Button } from "../ui/button";
import { $fetch } from "~/utils/$fetch";
import { assignFormErrors } from "~/lib/assign-form-errors";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function RegisterForm() {
  const navigate = useNavigate();
  const form = useForm({ resolver: zodResolver(baseSchema.register) });

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(values);
    const { data, error } = await $fetch<{
      message: string;
      next: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (error || !data) {
      assignFormErrors(error.errors, form);
      return;
    }

    localStorage.setItem("email", values.email);
    toast.success(data.message);
    navigate(data.next);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>name</label>
        <Input {...form.register("name")} />
        {form.formState.errors.name && (
          <p>{form.formState.errors.name.message}</p>
        )}
      </div>

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
