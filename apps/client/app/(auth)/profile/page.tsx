"use client";

import RegistationFormInputs from "@/app/components/form/registation-form-inputs";
import ButtonLoadingSpinner from "@/app/components/loader/ButtonLoaderSpinner";
import { cn } from "@/lib/utils";
import UseProfile from "./profile-hooks";

const UserProfile = () => {
  const {
    onSubmit,
    handleSubmit,
    register,
    errors,
    setProfilePic,
    profilePicError,
    setProfilePicError,
    imageUrl,
    loading,
  } = UseProfile();

  return (
    <form
      className="w-full max-w-md text-primary"
      onSubmit={handleSubmit(onSubmit)}
    >
      <RegistationFormInputs
        register={register}
        errors={errors}
        profilePic={{ setProfilePic, profilePicError, setProfilePicError }}
        showImagePreview={true} // This prop indicates that we want to show an image preview
        imageUrl={imageUrl} // This prop provides the URL for the image preview
      />
      <div className="mt-4">
        <button
          disabled={loading}
          type="submit"
          className={cn(
            `bg-secondary text-secondary w-full transform rounded-lg px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300 focus:outline-none focus:ring focus:ring-opacity-50 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`,
          )}
        >
          {loading ? (
            <ButtonLoadingSpinner loadingText={"loading"} />
          ) : (
            <span>Update Profile</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default UserProfile;
