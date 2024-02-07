import {
  ACCEPTED_FILE_TYPES,
  MAX_UPLOAD_SIZE,
  TSignupSchema,
} from "@/lib/validation-schemas";
import { ChangeEvent, SetStateAction, useRef, useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormFieldError from "./form-field-error";

type RegistationFormInputsProps = {
  register: UseFormRegister<TSignupSchema>;
  errors: FieldErrors<TSignupSchema>;
  profilePic: {
    setProfilePic: React.Dispatch<SetStateAction<File | null>>;
    profilePicError: string;
    setProfilePicError: React.Dispatch<SetStateAction<string>>;
  };
};
export default function RegistationFormInputs({
  register,
  errors,
  profilePic: { setProfilePic, profilePicError, setProfilePicError },
}: RegistationFormInputsProps) {
  const profilePicInputRef = useRef<HTMLInputElement | null>(null);

  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (!file) {
      setProfilePic(null);
      setProfilePicError("Profile picture is required.");
      return;
    }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setProfilePic(null);
      setProfilePicError("Please upload a valid image file (jpeg, jpg, png)");
    } else if (file.size > MAX_UPLOAD_SIZE) {
      setProfilePic(null);
      setProfilePicError("Please upload an image file less than 10MB");
    } else {
      setProfilePic(file);
      setProfilePicError(null);
    }
  };

  return (
    <>
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </span>
        <input
          className="w-full px-11 py-2 formInput"
          placeholder="Name"
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
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </span>
        <input
          className="w-full px-11 py-2 formInput"
          {...register("email")}
          placeholder="Email"
        />
      </div>
      <FormFieldError fieldError={errors.email} />
      <div className="relative flex justify-between gap-x-2">
        <div>
          <div className="relative mt-2 flex items-center">
            <span className="absolute">
              <svg
                className="mx-3 h-6 w-6 text-gray-300"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M739.0208 485.376a26.624 26.624 0 1 0 52.736-8.192 269.4144 269.4144 0 0 0-244.1728-241.664 26.7264 26.7264 0 1 0-2.0992 53.3504c1.6384 0.1024 164.7104 8.704 193.536 196.4544z m59.5456-254.7712C616.96 48.9472 451.1744 112.6912 444.2624 115.5072a26.7264 26.7264 0 0 0 19.8656 49.5616c1.3824-0.5632 139.776-53.7088 296.704 103.3216 144.5888 144.64 102.144 291.4816 100.352 297.5744a26.7264 26.7264 0 0 0 50.8928 15.9744c2.304-7.424 54.784-182.9888-113.5104-351.3344z m-62.464 629.0432c-2.56 2.56-10.9056 8.5504-33.536 8.5504-73.3184 0-213.8624-61.696-349.184-197.0688-177.6128-177.8176-217.9584-353.3824-188.3136-383.0272 19.1488-19.2512 59.0336-59.1872 96.768-59.1872 20.8384 0 40.6528 12.032 60.416 36.7616 57.088 71.168 32.3584 95.5392-8.6016 135.9872l-7.5776 7.5264c-10.24 10.24-15.7184 23.808-15.7184 39.168 0 24.576 11.8272 68.9664 114.2784 171.4688 102.5024 102.5024 146.8928 114.3296 171.3664 114.3296 15.36 0 28.8256-5.376 39.0656-15.616l7.5264-7.5776c22.272-22.6304 41.5232-42.1376 65.8432-42.1376 18.8928 0 42.496 11.264 70.144 33.4848 23.5008 18.944 35.4816 37.7856 36.5056 57.5488 2.1504 38.7072-39.1168 79.9744-58.9824 99.84z m-47.616-244.224c-46.6944 0-77.056 30.8224-103.8848 58.0096l-8.6016 7.3216c-8.192 0-42.0352-7.1168-133.632-98.7136C335.5136 475.136 343.808 446.976 343.808 446.976l7.3216-7.3216c42.1888-41.6256 99.9424-98.6624 12.8-207.4112-30.208-37.632-64.512-56.7296-102.0928-56.7296-59.8016 0-108.4416 48.64-134.5024 74.752-77.1584 77.312 35.7888 305.8688 188.3648 458.6496C462.4896 855.8592 615.7312 921.6 702.5664 921.6c31.2832 0 55.296-8.192 71.2704-24.1664 25.2928-25.2928 77.9264-77.9776 74.5472-140.4416-1.8944-35.328-20.8896-67.7376-56.4224-96.3072-37.888-30.464-71.7824-45.2608-103.5264-45.2608z"
                  fill="#bdbdbd"
                />
              </svg>
            </span>
            <input
              className="w-full pl-11 pr-1 py-2 formInput"
              {...register("phoneNumber")}
              placeholder="Phone Number"
            />
          </div>
          <FormFieldError fieldError={errors.phoneNumber} />
        </div>
        <div>
          <label
            htmlFor="profilePicture"
            className="mx-auto mt-2 flex cursor-pointer items-center rounded-lg border-2 border-dashed bg-white px-3 py-[0.4rem] text-center"
            onClick={() => {
              profilePicInputRef &&
                profilePicInputRef.current &&
                profilePicInputRef.current.click();
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
              {profilePicInputRef.current?.value || "Picture"}
            </h2>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={profilePicInputRef}
              onChange={handleProfilePicChange}
            />
          </label>
          <div className="text-red-600 my-1 text-sm h-2">{profilePicError}</div>
        </div>
      </div>

      <div className="relative mt-2 flex items-center">
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
          className="w-full px-10 py-3 formInput"
          {...register("password")}
          placeholder="Password"
          type="password"
        />
      </div>
      <FormFieldError fieldError={errors.password} />
    </>
  );
}
