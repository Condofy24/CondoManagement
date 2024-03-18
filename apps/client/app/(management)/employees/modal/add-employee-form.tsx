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
import { createEmployee } from "@/actions/management-actions";
import { useAppSelector } from "@/redux/store";
import { useCallback, useContext } from "react";
import { EmployeesContext } from "@/context/employees-context";
import toast from "react-hot-toast";

export default function AddEmployeeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCreateEmployeeSchema>({
    resolver: zodResolver(createEmployeeSchema),
  });
  const { admin, token } = useAppSelector((state) => state.auth.value);
  const { setShowModal, setRefetch } = useContext(EmployeesContext);

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const onSubmit = useCallback(
    async (values: TCreateEmployeeSchema) => {
      if (admin?.companyId && token !== null) {
        try {
          await createEmployee(admin.companyId, values, token);
          toast.success(`Created ${values.name}`);
          setRefetch(true);
        } catch (error) {
          toast.error((error as Error).message);
        }
      }
      closeModalHandler();
    },
    [admin, token]
  );

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
        <Select onValueChange={(value: string) => setValue("role", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Manager</SelectItem>
            <SelectItem value="1">Staff</SelectItem>
            <SelectItem value="2">Accountant</SelectItem>
          </SelectContent>
        </Select>
        <FormFieldError fieldError={errors.role} />
      </div>
      <div className="flex flex-row justify-center gap-10">
        <Button type="button" onClick={closeModalHandler}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
