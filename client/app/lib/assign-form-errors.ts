import type { UseFormReturn } from "react-hook-form";

export function assignFormErrors(
  errors: {
    code: string;
    path: string[];
    message: string;
  }[],
  form: UseFormReturn<any>
) {
  errors.forEach((err) => {
    form.setError(err.path.join("."), {
      type: "deps",
      message: err.message,
    });
  });
}
