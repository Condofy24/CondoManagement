import { useState } from "react";
import { useForm } from "react-hook-form";
import { TLoginSchema, loginSchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { login } from "@/redux/services/authService";

function LoginHooks() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

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
