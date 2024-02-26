import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import FormFieldError from "@/app/components/form/form-field-error";
import { AssetType } from "@/types";
import {
  TCreateParkingSchema,
  createParkingSchema,
} from "@/lib/unit-validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function CreateAsset({ assetType }: { assetType: AssetType }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateParkingSchema>({
    resolver: zodResolver(createParkingSchema),
  });

  const onSubmit = (data: TCreateParkingSchema) => {
    console.log(data);
  };

  return (
    <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
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
      <Button type="submit">SUBMIT</Button>
    </form>
  );
}
