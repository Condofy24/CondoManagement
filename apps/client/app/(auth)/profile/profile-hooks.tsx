import { TSignupSchema, signupSchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "@/redux/services/user-service";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { UserRolesEnum } from "@/types";

export default function UseProfile() {
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicError, setProfilePicError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [imageUrl, setImagePreviewUrl] = useState<string | undefined>(
    undefined
  );
  const user = useAppSelector((state) => state.authReducer.value.user);

  const isManager = user.role === UserRolesEnum.MANAGER;

  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    defaultValues: user, // Set the default values as the current user data
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

  return {
    onSubmit,
    handleSubmit,
    register,
    errors,
    setProfilePic,
    profilePicError,
    setProfilePicError,
    imageUrl,
    loading,
    isManager,
  };
}
