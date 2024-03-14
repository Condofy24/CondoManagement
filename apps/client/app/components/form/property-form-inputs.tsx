import { MAX_UPLOAD_SIZE, TPropertySchema } from "@/lib/validation-schemas";
import { ChangeEvent, SetStateAction, useRef, useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormFieldError from "./form-field-error";

type PropertyFormInputProps = {
  register: UseFormRegister<TPropertySchema>;
  errors: FieldErrors<TPropertySchema>;
  propertyFile: {
    setPropertyFile: React.Dispatch<SetStateAction<File | null>>;
    propertyFileError: string | null;
    setPropertyFileError: React.Dispatch<SetStateAction<string | null>>;
  };
};
export default function PropertyFormInputs({
  register,
  errors,
  propertyFile: { setPropertyFile, propertyFileError, setPropertyFileError },
}: PropertyFormInputProps) {
  const propertyFileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePropertyFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (!file) {
      setPropertyFile(null);
      setPropertyFileError("Property file is required.");
      return;
    } else if (file.size > MAX_UPLOAD_SIZE) {
      setPropertyFile(null);
      setPropertyFileError("Please upload a valid file less than 10MB");
    } else {
      setPropertyFile(file);
      setPropertyFileError(null);
    }
  };

  return (
    <>
      <div className="relative mt-10 flex items-center">
        <span className="absolute">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-3 h-6 w-6 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.121,9.88l-7.832-7.836c-0.155-0.158-0.428-0.155-0.584,0L1.842,9.913c-0.262,0.263-0.073,0.705,0.292,0.705h2.069v7.042c0,0.227,0.187,0.414,0.414,0.414h3.725c0.228,0,0.414-0.188,0.414-0.414v-3.313h2.483v3.313c0,0.227,0.187,0.414,0.413,0.414h3.726c0.229,0,0.414-0.188,0.414-0.414v-7.042h2.068h0.004C18.331,10.617,18.389,10.146,18.121,9.88 M14.963,17.245h-2.896v-3.313c0-0.229-0.186-0.415-0.414-0.415H8.342c-0.228,0-0.414,0.187-0.414,0.415v3.313H5.032v-6.628h9.931V17.245z M3.133,9.79l6.864-6.868l6.867,6.868H3.133z"
            />
          </svg>
        </span>
        <input
          className="w-full px-11 py-2 formInput"
          placeholder="Property Name"
          {...register("name")}
        />
      </div>
      <FormFieldError fieldError={errors.name} />
      <div className="relative mt-3 flex items-center">
        <span className="absolute">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-3 h-6 w-6 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589"
            />
          </svg>
        </span>
        <input
          className="w-full px-11 py-2 formInput"
          placeholder="Address"
          {...register("address")}
        />
      </div>
      <FormFieldError fieldError={errors.address} />

      <div className="mt-3">
        <label
          htmlFor="propertyFile"
          className="mx-auto mt-2 flex cursor-pointer items-center rounded-lg border-2 border-dashed bg-white px-3 py-[0.4rem] text-center"
          onClick={() => {
            propertyFileInputRef &&
              propertyFileInputRef.current &&
              propertyFileInputRef.current.click();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <h2 className="mx-3 text-gray-400">
            {propertyFileInputRef.current?.value ? "Uploaded" : "File"}
          </h2>
          <input
            type="file"
            accept=".pdf, .doc, .txt, .png, .jpeg"
            className="hidden"
            ref={propertyFileInputRef}
            onChange={handlePropertyFileChange}
          />
        </label>
        <div className="text-red-600 my-1 text-sm h-2">{propertyFileError}</div>
      </div>
    </>
  );
}
