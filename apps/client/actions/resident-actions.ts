import { API_URL } from "@/global";
import { TRequestSchema } from "@/lib/unit-validation-schemas";
import { TUnitKeySchema } from "@/lib/validation-schemas";
import { ReservationStatus } from "@/types";
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

export async function fetchAssociatedProperties(userId: string, token: string) {
  try {
    const result = await axios.get(
      `${API_URL}/unit/findAssociatedUnits/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return result.data;
  } catch (error: any) {
    let message = "An error occured while fetching your properties.";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}

export async function fetchUnitPayments(unitId: string, token: string) {
  try {
    const result = await axios.get(`${API_URL}/unit/payments/${unitId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error: any) {
    let message = "An error occured while fetching property payments.";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}

export async function fetchOwnerInfo(unitId: string, token: string) {
  try {
    const result = await axios.get(`${API_URL}/unit/owner/${unitId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error: any) {
    let message = "An error occured while fetching owner information";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}

export async function createRequest(
  unitId: string,
  data: TRequestSchema,
  token: string,
) {
  try {
    const result = await axios.post(`${API_URL}/requests/${unitId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data;
  } catch (error: any) {
    let message = "An error occured while creating request";

    if (error.response && error.response.data.message)
      message = error.response.data.message;
  }
}

/**** Facility & Reservation ***/
export async function fetchBuildingFacilities(
  buildingId: string,
  token: string,
) {
  try {
    const result = await axios.get(`${API_URL}/facility/${buildingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error: any) {
    let message = "An error occured when fetching facilities";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}

export async function fetchResidentReservations(userId: string, token: string) {
  try {
    const result = await axios.get(
      `${API_URL}/facility/reservations/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return result.data;
  } catch (error: any) {
    let message = "An error occured when fetching reservations";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}
export async function createReservation(
  availabilityId: string,
  userId: string,
  token: string,
) {
  try {
    const result = await axios.post(
      `${API_URL}/facility/reservation/${availabilityId}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return result.data;
  } catch (error: any) {
    let message = "An error occured when creating your reservation";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}
export async function fetchFacilityAvailabilities(
  facilityId: string,
  token: string,
) {
  try {
    const result = await axios.get(
      `${API_URL}/facility/availability/${facilityId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return result.data;
  } catch (error: any) {
    let message = "An error occured when fetching facility availabilities";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}

export async function cancelReservation(reservationId: string, token: string) {
  try {
    const result = await axios.patch(
      `${API_URL}/facility/update/${reservationId}`,
      {
        status: ReservationStatus.CANCELED,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return result.data;
  } catch (error: any) {
    let message = "An error occured when canceling your reservation";

    if (error.response && error.response.data.message)
      message = error.response.data.message;

    throw new Error(message);
  }
}
