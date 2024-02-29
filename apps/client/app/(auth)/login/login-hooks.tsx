"use client";
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
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useAppSelector((state) => state.auth.value);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: TLoginSchema) => {
    const result = await dispatch(login(data));
    if (result.type == "auth/login/rejected") {
      toast.error("Wrong credentials. Please try again.");
    } else {
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
