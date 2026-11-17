import axios from "axios";
import { API_URL } from "../../Util/util";
import { DropCalculatorInput } from "./types";


export async function requestBallisticCalculation(requestDetails: DropCalculatorInput) {
    let response = null;
    try {
        response = await axios.post(API_URL + `/GetBallisticCalculation`, requestDetails);
    } catch (error) {
        throw error;
    }
    return response.data;
}