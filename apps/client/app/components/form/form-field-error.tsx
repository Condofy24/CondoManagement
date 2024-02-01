import React from "react";
import { FieldError } from "react-hook-form";

type FormFieldErrorProps = {
  fieldError: FieldError | undefined;
};
export default function FormFieldError({ fieldError }: FormFieldErrorProps) {
  return (
    <div className="text-red-600 my-1 text-xs h-2">
      {fieldError && fieldError.message}
    </div>
  );
}
