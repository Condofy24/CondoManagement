import FormFieldError from "@/app/components/form/form-field-error";
import { Input } from "@/app/components/ui/input";
import { FacilityRegister, FacilityErrors } from "./facility-form-hook";

export default function FacilityHoursInput({
  errors,
  register,
  id,
}: {
  errors: FacilityErrors;
  register: FacilityRegister;
  id: string;
}) {
  {
  }
  return (
    <div className="flex flex-row gap-1 items-end flex-grow">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="openingTime">
          Opening Hours
        </label>
        <Input
          id="openingTime"
          {...register(`items.${id as unknown as number}.openingTime`)}
          placeholder="HH:MM"
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError
          fieldError={
            errors.items?.[id as unknown as number]?.openingTime ?? undefined
          }
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="closingTime">
          Closing Hours
        </label>
        <Input
          id="closingTime"
          {...register(`items.${id as unknown as number}.closingTime`)}
          placeholder="HH:MM"
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError
          fieldError={
            errors.items?.[id as unknown as number]?.closingTime ?? undefined
          }
        />
      </div>
    </div>
  );
}
