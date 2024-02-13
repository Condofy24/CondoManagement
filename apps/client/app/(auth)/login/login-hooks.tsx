import { useState } from "react";
import { useForm } from "react-hook-form";
import { TLoginSchema, loginSchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { login } from "@/redux/services/auth-service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function LoginHooks() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const {error, success} = useAppSelector((state) => state.authReducer.value);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: TLoginSchema) => {
    setLoading(true);

    dispatch(login(data));

    setLoading(false);

    if (error) {
      toast.error(error+": wrong credentials or non-existing user");
    }else if (success){
      toast.success("Login successful");
      router.push("/");
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    loading,
    onSubmit,
  };
}

export default LoginHooks;
