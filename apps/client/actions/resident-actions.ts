import { API_URL } from "@/global";
import { TUnitKeySchema } from "@/lib/validation-schemas";
import axios from "axios";

export async function claimOwnerUnit(data: TUnitKeySchema, token: string) {
  try {
    await axios.post(
      `${API_URL}/unit/claim/${data.unitKey}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error: any) {
    let message = "An error occured while claiming unit";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}
