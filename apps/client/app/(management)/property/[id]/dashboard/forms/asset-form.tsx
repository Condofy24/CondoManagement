import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import FormFieldError from "@/app/components/form/form-field-error";
import { Asset, BuildingAsset, BuildingAssetType, Parking } from "@/types";
import { useAssetManagement } from "@/context/asset-management-context";
import useAssetForm from "./asset-form-hook";

export default function AssetForm({
  assetType,
}: {
  assetType: BuildingAssetType;
}) {
  const { asset, mode, setShowDialog } = useAssetManagement();
  const { register, handleSubmit, errors, onSubmit } = useAssetForm();

  const assetName =
    assetType === BuildingAssetType.parking ? "Parking" : "Storage";

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
          value={
            mode === "edit"
              ? assetType == BuildingAssetType.parking
                ? (asset as unknown as Parking).parkingNumber
                : (asset as unknown as Storage).storageNumber
              : ""
          }
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
          value={mode === "edit" ? asset?.fees : ""}
        />
        <FormFieldError fieldError={errors.fees} />
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
