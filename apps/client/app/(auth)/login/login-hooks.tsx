import { useState } from "react";
import { useForm } from "react-hook-form";
import { TLoginSchema, loginSchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { login } from "@/redux/services/auth-service";
import { useRouter } from "next/navigation";

function LoginHooks() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

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

    router.push("/");

    setLoading(false);
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
