import { IoDocumentText } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
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

function CreateRequestForm() {
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
          <form className="p-4" /*onSubmit={handleSubmit(onSubmit)}*/>
            <div className="mb-4">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="unitNumber"
              >
                Unit Number
              </label>
              <Input
                id="unitNumber"
                // {...register("name")}
                placeholder="1"
                className="dark:bg-white dark:text-black"
                type="number"
              />
              {/* <FormFieldError fieldError={errors.name} /> */}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <Input
                id="title"
                // {...register("email")}
                placeholder="Request Title"
                className="dark:bg-white dark:text-black"
                type="text"
              />
              {/* <FormFieldError fieldError={errors.email} /> */}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="amount">
                Type
              </label>
              <Select
              // onValueChange={(value: string) => setValue("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Manager</SelectItem>
                  <SelectItem value="1">Staff</SelectItem>
                  <SelectItem value="2">Accountant</SelectItem>
                </SelectContent>
              </Select>
              {/* <FormFieldError fieldError={errors.role} /> */}
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="phoneNumber"
                placeholder="describe the issue here..."
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 dark:bg-white dark:text-black"
                //{...register("description")}
              />
              {/* <FormFieldError fieldError={errors.phoneNumber} /> */}
            </div>
            <div className="flex flex-row justify-center gap-10">
              <Button type="button">Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateRequestForm;
