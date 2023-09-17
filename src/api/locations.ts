import { LocationSearchRequestBody } from './../types/types';
import api from "./index";


export const searchLocations = async (body: LocationSearchRequestBody) => {
    try {
        const response = await api.post("/locations/search", body);
        return response.data;
    } catch (error) {
        throw error;
    }
};
