import { TPropertySchema } from "./lib/validation-schemas";
import axios from "axios";
import { API_URL } from "@/global";

export async function createProperty(companyId: string, buildingData: TPropertySchema, file: File, token: string) {

    try {
        await axios.post(`${API_URL}/building/${companyId}`, {...buildingData, file}, { headers: {"Authorization" : `Bearer ${token}`,'Content-Type': 'multipart/form-data'} });
    } catch (error: any) {

        return new Error("could not create specified property");
    }
}