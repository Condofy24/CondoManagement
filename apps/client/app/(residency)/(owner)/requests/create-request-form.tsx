import { IoDocumentText } from "react-icons/io5";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import FormFieldError from "@/app/components/form/form-field-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { RequestType, Unit } from "@/types";
import toast from "react-hot-toast";
import { fetchAssociatedProperties } from "@/actions/resident-actions";
import { Textarea } from "@/app/components/ui/textarea";
import useRequest from "./request-hook";

function CreateRequestForm() {
  const { user, token } = useAppSelector((state) => state.auth.value);
  const [properties, setProperties] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setValue,
    reset,
  } = useRequest();

  useEffect(() => {
    async function fetchProperties() {
      setIsLoading(true);
      try {
        const properties = await fetchAssociatedProperties(
          user.id as string,
          token as string
        );
        setProperties(properties);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties();
  }, [token, user?.id]);

  return (
    <div className="mb-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2">
      <Dialog>
        <DialogTrigger className="flex items-center">
          <IoDocumentText className="mr-1" />
          Create Request
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Request</DialogTitle>
          </DialogHeader>
          <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="unitNumber"
              >
                Unit number
              </label>
              <Select
                onValueChange={(value: string) => setValue("unitNumber", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit number" />
                </SelectTrigger>
                <SelectContent>
                  {properties?.map((property) => {
                    return (
                      <SelectItem key={property.id} value={property.id}>
                        {property.unitNumber}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormFieldError fieldError={errors.unitNumber} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Request Title"
                className="dark:bg-white dark:text-black"
                type="text"
              />
              <FormFieldError fieldError={errors.title} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="amount">
                Type
              </label>
              <Select
                onValueChange={(value: string) => setValue("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RequestType.ADMIN}>
                    {RequestType.ADMIN}
                  </SelectItem>
                  <SelectItem value={RequestType.FINANCIAL}>
                    {RequestType.FINANCIAL}
                  </SelectItem>
                  <SelectItem value={RequestType.STAFF}>
                    {RequestType.STAFF}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormFieldError fieldError={errors.type} />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <Textarea
                id="description"
                placeholder="describe the issue here..."
                className="border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 dark:bg-white dark:text-black"
                {...register("description")}
              />
              <FormFieldError fieldError={errors.description} />
            </div>
            <div className="flex flex-row justify-center">
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      reset();
                    }}
                  >
                    Close
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit">Submit</Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateRequestForm;
