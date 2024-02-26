import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import UseCreateUnit from "./create-unit-hooks";
import FormFieldError from "@/app/components/form/form-field-error";

export default function CreateUnit() {
  const { register, handleSubmit, errors, onSubmit } = UseCreateUnit();

  return (
    <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="name">
          Owner Full Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Owner Name"
          className="dark:bg-white dark:text-black"
          {...register("name")}
        />
        <FormFieldError fieldError={errors.name} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="fees">
          Fees ($CAD)
        </label>
        <Input
          id="fees"
          type="number"
          placeholder="Fees"
          className="dark:bg-white dark:text-black"
          {...register("fees", { valueAsNumber: true })}
        />
        <FormFieldError fieldError={errors.fees} />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-bold mb-2" htmlFor="size">
          Size (m<sup>2</sup>)
        </label>
        <Input
          id="size"
          type="number"
          placeholder="Size"
          className="dark:bg-white dark:text-black"
          {...register("size", { valueAsNumber: true })}
        />
        <FormFieldError fieldError={errors.size} />
      </div>
      <Button type="submit">SUBMIT</Button>
    </form>
  );
}
