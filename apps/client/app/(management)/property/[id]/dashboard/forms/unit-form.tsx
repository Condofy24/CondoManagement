import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import useUnitForm from "./unit-form-hook";
import FormFieldError from "@/app/components/form/form-field-error";
import { useAssetManagement } from "@/context/asset-management-context";
import { Unit } from "@/types";

export default function UnitForm() {
  const { register, handleSubmit, errors, onSubmit } = useUnitForm();
  const { asset, mode, setShowDialog } = useAssetManagement();

  return (
    <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="name">
          Unit Number
        </label>
        <Input
          {...register("unitNumber")}
          id="unitNumber"
          placeholder="Unit Number"
          className="dark:bg-white dark:text-black"
          value={mode === "edit" ? (asset as Unit).unitNumber : ""}
        />
        <FormFieldError fieldError={errors.unitNumber} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="fees">
          Fees ($CAD)
        </label>
        <Input
          {...register("fees", { valueAsNumber: true })}
          id="fees"
          placeholder="Fees"
          className="dark:bg-white dark:text-black"
          value={mode === "edit" ? (asset as Unit).fees : ""}
        />
        <FormFieldError fieldError={errors.fees} />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-bold mb-2" htmlFor="size">
          Size (m<sup>2</sup>)
        </label>
        <Input
          id="size"
          placeholder="Size"
          className="dark:bg-white dark:text-black"
          {...register("size", { valueAsNumber: true })}
          value={mode === "edit" ? (asset as Unit).size : ""}
        />
        <FormFieldError fieldError={errors.size} />
      </div>
      <div className="flex flex-row justify-center gap-10">
        <Button type="button" onClick={() => setShowDialog(false)}>
          Cancel
        </Button>
        <Button type="submit">{mode === "create" ? "Create" : "Edit"}</Button>
      </div>
    </form>
  );
}
