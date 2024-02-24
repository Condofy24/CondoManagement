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
          {...register("propertyName")}
        />
      </div>
      <FormFieldError fieldError={errors.propertyName} />
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

      {/* below are the count fields (unit, parking, locker) requested upon removal. Code is held as reference if ever the form requires further refacrtoring  */}

      {/* <div className="relative mt-3 flex items-center">
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
              d="M17.391,2.406H7.266c-0.232,0-0.422,0.19-0.422,0.422v3.797H3.047c-0.232,0-0.422,0.19-0.422,0.422v10.125c0,0.232,0.19,0.422,0.422,0.422h10.125c0.231,0,0.422-0.189,0.422-0.422v-3.797h3.797c0.232,0,0.422-0.19,0.422-0.422V2.828C17.812,2.596,17.623,2.406,17.391,2.406 M12.749,16.75h-9.28V7.469h3.375v5.484c0,0.231,0.19,0.422,0.422,0.422h5.483V16.75zM16.969,12.531H7.688V3.25h9.281V12.531z"
            />
          </svg>
        </span>
        <input
          className="w-full px-11 py-2 formInput"
          {...register("unitCount")}
          placeholder="Unit Count"
        />
      </div>
      <FormFieldError fieldError={errors.unitCount} />
        <div>
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
              d="M17.592,8.936l-6.531-6.534c-0.593-0.631-0.751-0.245-0.751,0.056l0.002,2.999L5.427,9.075H2.491c-0.839,0-0.162,0.901-0.311,0.752l3.683,3.678l-3.081,3.108c-0.17,0.171-0.17,0.449,0,0.62c0.169,0.17,0.448,0.17,0.618,0l3.098-3.093l3.675,3.685c-0.099-0.099,0.773,0.474,0.773-0.296v-2.965l3.601-4.872l2.734-0.005C17.73,9.688,18.326,9.669,17.592,8.936 M3.534,9.904h1.906l4.659,4.66v1.906L3.534,9.904z M10.522,13.717L6.287,9.48l4.325-3.124l3.088,3.124L10.522,13.717z M14.335,8.845l-3.177-3.177V3.762l5.083,5.083H14.335z"
            />
          </svg>
            </span>
            <input
              className="w-full pl-11 pr-1 py-2 formInput"
              {...register("parkingCount")}
              placeholder="Parking Count"
            />
          </div>
          <FormFieldError fieldError={errors.parkingCount} />
        </div>
        <div className="relative mt-3 flex items-center">
          <span className="absolute">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-3 h-6 w-6 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </span>
          <input
            className="w-full pl-11 pr-1 py-2 formInput"
            {...register("lockerCount")}
            placeholder="Locker Count"
            type="password"
          />
      </div>
      <FormFieldError fieldError={errors.lockerCount} /> */}
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
            accept=".pdf, .doc, .txt"
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
