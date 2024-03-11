import { API_URL } from "@/global";
import { TManagerSignupSchema, TSignupSchema } from "@/lib/validation-schemas";
import axios from "axios";

export async function registerUser(
  user: TSignupSchema | { profilePic: File | null },
) {
  const { profilePic, ...userInfo } = user as any;
  try {
    await axios.post(
      `${API_URL}/user`,
      { image: profilePic, ...userInfo },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  } catch (error: any) {
    let message = "An error occurred while registering your account";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}

export async function registerManager(
  manager: TManagerSignupSchema | { profilePic: File | null },
) {
  try {
    const { profilePic, company, address, ...managerData } = manager as any;

    await axios.post(
      `${API_URL}/user/manager`,
      {
        companyName: company,
        companyLocation: address,
        image: profilePic,
        ...managerData,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  } catch (error: any) {
    let message = "An error occurred while registering your account";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}
