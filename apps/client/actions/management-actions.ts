import {
  TCreateEmployeeSchema,
  TPropertySchema,
} from "../lib/validation-schemas";
import axios from "axios";
import { API_URL } from "@/global";
import { TAddPaymentSchema, TUnitSchema } from "../lib/unit-validation-schemas";
import { BuildingAssetType, Parking, Unit, Storage } from "../types";
import { AssetTypes } from "../app/(management)/property/[id]/dashboard/manage-building-assets-hook";

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
    let message = "An error occured while creating property";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}

export async function createEmployee(
  companyId: string,
  employeeData: TCreateEmployeeSchema,
  token: string,
) {
  try {
    const response = await axios.post(
      `${API_URL}/user/employee`,
      { ...employeeData, companyId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error: any) {
    let message = "An error occurred while creating employee";
    if (error.response && error.response.data.error)
      message = error.response.data.error;

    throw new Error(message);
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
    let message = "An error occurred while fetching properties";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}

export async function fetchEmployees(companyId: string, token: string) {
  try {
    const response = await axios.get(`${API_URL}/user/employees/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    let message = "An error occurred while fetching employees";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}

export async function deleteEmployee(employeeId: string, token: string) {
  try {
    const response = await axios.delete(`${API_URL}/user/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    let message = "An error occurred while deleting";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}

export async function createUnit(
  buildingId: string,
  data: TUnitSchema,
  token: string,
) {
  try {
    const res = await axios.post(`${API_URL}/unit/${buildingId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status;
  } catch (error: any) {
    let message = "An error occurred while creating unit";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}

export async function addNewPayment(
  unitId: string,
  data: TAddPaymentSchema,
  token: string,
) {
  try {
    const res = await axios.post(
      `${API_URL}/unit/makeNewPayment/${unitId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Keep: Unused in the backend but will be used later
        },
      },
    );

    return res.status;
  } catch (error: any) {
    let message = "An error occurred while making payment";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}

export const fetchAssets = async (
  assetPage: BuildingAssetType,
  buildingId: string,
  token: string,
): Promise<AssetTypes> => {
  switch (assetPage) {
    case BuildingAssetType.unit:
      const { data: unitData } = await axios.get<Unit[]>(
        `${API_URL}/unit/${buildingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return unitData;

    case BuildingAssetType.parking:
      const { data: parkingData } = await axios.get<Parking[]>(
        `${API_URL}/parking/building/${buildingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return parkingData;

    case BuildingAssetType.storage:
      const { data: storageData } = await axios.get<Storage[]>(
        `${API_URL}/storage/building/${buildingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return storageData;

    default:
      throw new Error("Invalid asset type");
  }
};

// export async function updateAsset(
//   buildingId: string,
//   data: TUnitSchema,
//   token: string
// ) {
//   const userData = {
//     ...data,
//     isOccupiedByRenter: getIsOccupiesByRenter(data.isOccupiedByRenter),
//   };

//   try {
//     const res = await axios.post(`${API_URL}/unit/${buildingId}`, userData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return res.status;
//   } catch (error: any) {
//     throw new Error("could not create specified unit");
//   }
// }
