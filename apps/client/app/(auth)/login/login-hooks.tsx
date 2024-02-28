"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TLoginSchema, loginSchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/redux/services/auth-service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useAppSelector, AppDispatch } from "@/redux/store";

function LoginHooks() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loggedIn } = useAppSelector((state) => state.auth.value);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: TLoginSchema) => {
    setLoading(true);

    await dispatch(login(data));

    setLoading(false);

    if (loggedIn) {
      toast.success("Login successful");
      router.push("/");
    } else {
      toast.error("Login failed");
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
