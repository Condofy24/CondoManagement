import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import FormFieldError from "@/app/components/form/form-field-error";
import { BuildingAsset } from "@/types";
import { useAssetManagement } from "@/context/asset-management-context";
import useAssetForm from "./asset-form-hook";

export default function AssetForm({ type }: { type: BuildingAsset }) {
  const { currentAssets, asset, mode, setShowDialog } = useAssetManagement();

  console.log(currentAssets);

  const { register, handleSubmit, errors, onSubmit, isDirty } = useAssetForm(
    type,
    asset,
  );

  const assetName = type === BuildingAsset.parking ? "Parking" : "Storage";

  return (
    <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="fees">
          {`${assetName} Number`}
        </label>
        <Input
          id="assetNumber"
          {...register("assetNumber")}
          placeholder={`${assetName} Number`}
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError fieldError={errors.assetNumber} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="fees">
          Fees ($CAD)
        </label>
        <Input
          id="fees"
          {...register("fees", { valueAsNumber: true })}
          placeholder="Fees"
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError fieldError={errors.fees} />
      </div>

      <div className="flex flex-row justify-center gap-10">
        <Button type="button" onClick={() => setShowDialog(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isDirty}>
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </Button>
      </div>
    </form>
  );
}
