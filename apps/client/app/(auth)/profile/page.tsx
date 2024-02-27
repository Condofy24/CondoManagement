"use client";

import RegistationFormInputs from "@/app/components/form/registation-form-inputs";
import ButtonLoadingSpinner from "@/app/components/loader/ButtonLoaderSpinner";
import { cn } from "@/lib/utils";
import { TSignupSchema, signupSchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "@/redux/services/user-service"; 
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicError, setProfilePicError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [imageUrl, setImagePreviewUrl] = useState<string | undefined>(undefined);


  
  const currentUserData = {}; // Replace with actual data fetching logic

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setProfilePic(file);

      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file);
      setImagePreviewUrl(fileUrl); // Set the image preview URL

      // Clean up the URL after the component is unmounted
      return () => URL.revokeObjectURL(fileUrl);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TSignupSchema>({
    defaultValues: currentUserData, // Set the default values as the current user data
    resolver: zodResolver(signupSchema), 
  });

  const onSubmit = async (data: TSignupSchema) => {
    setLoading(true);
  
    try {
      if (profilePic) {
        //await dispatch(updateUserProfile({ ...data, profilePic, id }));
        router.push("/profile"); // Redirect to the profile page
      } else {
        setProfilePicError("Profile picture is required");
      }
    } catch (error) {
    } finally {
      setLoading(false); 
    }
  };

  // If the user cancels the update
  const handleCancel = () => {
    reset();
  };

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
