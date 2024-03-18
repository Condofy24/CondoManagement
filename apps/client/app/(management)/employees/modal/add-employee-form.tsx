import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import FormFieldError from "@/app/components/form/form-field-error";
import { useForm } from "react-hook-form";
import {
  TCreateEmployeeSchema,
  createEmployeeSchema,
} from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export default function AddEmployeeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCreateEmployeeSchema>({
    resolver: zodResolver(createEmployeeSchema),
  });

  const onSubmit = (values: TCreateEmployeeSchema) => {
    console.log(values);
  };

  return (
    <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="amount">
          Name
        </label>
        <Input
          id="name"
          {...register("name")}
          placeholder="John Doe"
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError fieldError={errors.name} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="amount">
          Email
        </label>
        <Input
          id="email"
          {...register("email")}
          placeholder="john@company.com"
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError fieldError={errors.email} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="amount">
          Phone Number
        </label>
        <Input
          id="phoneNumber"
          {...register("phoneNumber")}
          placeholder="1234567890"
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError fieldError={errors.phoneNumber} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="amount">
          Role
        </label>
        <Select
          onValueChange={(value: string) => setValue("role", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Manager</SelectItem>
            <SelectItem value="1">Staff</SelectItem>
            <SelectItem value="2">Accountant</SelectItem>
          </SelectContent>
        </Select>
        <FormFieldError fieldError={errors.phoneNumber} />
      </div>
      <div className="flex flex-row justify-center gap-10">
        <Button
          type="button"
          // onClick={() => {
          //   setShowPaymentDialog(false);
          //   setAsset(null);
          // }}
        >
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
