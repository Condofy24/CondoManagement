import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import FormFieldError from "@/app/components/form/form-field-error";
import useAddPaymentForm from "./add-payment-form-hook";
import { useAssetManagement } from "@/context/asset-management-context";

export default function AddPaymentForm() {
  const { register, handleSubmit, errors, onSubmit } = useAddPaymentForm();
  const { setShowPaymentDialog, setAsset } = useAssetManagement();

  return (
    <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="amount">
          Amount Paid
        </label>
        <Input
          id="amount"
          {...register("amount")}
          placeholder="100"
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError fieldError={errors.amount} />
      </div>
      <div className="flex flex-row justify-center gap-10">
        <Button
          type="button"
          onClick={() => {
            setShowPaymentDialog(false);
            setAsset(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
