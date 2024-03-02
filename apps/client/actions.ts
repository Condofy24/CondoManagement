import { TPropertySchema } from "./lib/validation-schemas";
import axios from "axios";
import { API_URL } from "@/global";
import { TUnitSchema } from "./lib/unit-validation-schemas";

export async function createProperty(
  companyId: string,
  buildingData: TPropertySchema,
  file: File,
  token: string,
) {
  try {
    await axios.post(
      `${API_URL}/building/${companyId}`,
      { ...buildingData, file },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
  } catch (error: any) {
    return new Error("could not create specified property");
  }
}

export async function fetchProperties(companyId: string, token: string) {
  try {
    const response = await axios.get(`${API_URL}/building/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return new Error("could not fetch properties");
  }
}

export async function createUnit(
  buildingId: string,
  data: TUnitSchema,
  token: string,
) {
  const userData = {
    ...data,
    isOccupiedByRenter: getIsOccupiesByRenter(data.isOccupiedByRenter),
  };

  try {
    const res = await axios.post(`${API_URL}/unit/${buildingId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status;
  } catch (error: any) {
    throw new Error("could not create specified unit");
  }
}

const getIsOccupiesByRenter = (isOccupiedByRenter: string): boolean => {
  return isOccupiedByRenter === "Yes";
};
