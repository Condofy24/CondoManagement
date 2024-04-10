import {
  createRequest,
  fetchAssociatedProperties,
  fetchRequests,
} from "@/actions/resident-actions";
import { TRequestSchema, requestSchema } from "@/lib/unit-validation-schemas";
import { useAppSelector } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";

export default function useRequest() {
  const { user, token } = useAppSelector((state) => state.auth.value);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TRequestSchema>({
    resolver: zodResolver(requestSchema),
  });

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const requests = await fetchRequests(
        user.id as string,
        token as string,
        user.role,
      );
      setRequests(requests);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [user.id, user.role, token]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties, token, user.id]);

  const onSubmit = async (data: TRequestSchema) => {
    try {
      await createRequest(data.unitNumber as string, data, token as string);
      reset();
      toast.success(`Facility created successfully`);
      await fetchProperties();
    } catch (error) {
      reset();
      toast.error((error as Error).message);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    reset,
    requests,
    user,
    fetchProperties,
    token,
  };
}
