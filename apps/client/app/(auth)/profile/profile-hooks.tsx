import { TSignupSchema, signupSchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "@/redux/services/user-service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { UserRolesEnum } from "@/types";
import toast from "react-hot-toast";

export default function UseProfile() {
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicError, setProfilePicError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [imageUrl, setImagePreviewUrl] = useState<string | undefined>(
    undefined,
  );

  let user = null;
  if (typeof window !== "undefined") {
    user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null;
  }

  const isManager = user?.role === UserRolesEnum.MANAGER;

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
      } else {
        setProfilePicError("Profile picture is required");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // If the user cancels the update
  const handleCancel = () => {
    reset();
  };

  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>,
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