"use server";
import { satellite } from "@/config/api.config";
import { APIBaseResponse } from "@/interfaces/api.interface";
import {
  ICounter,
  ICounterResponse,
  ICreateCounterRequest,
  IUpdateCounterRequest,
} from "@/interfaces/services/counter.interface";
import { errorMessage } from "@/utils/error.util";

const API_BASE_PATH = "/api/v1/counters"; // path counter

// ------------------------ GET ALL COUNTERS ------------------------
export const apiGetAllCounters = async () => {
  try {
    const res = await satellite.get<APIBaseResponse<ICounter[]>>(
      `${API_BASE_PATH}/`
    );
    return res.data;
  } catch (error) {
    return errorMessage<ICounter[]>(error);
  }
};

// ------------------------ GET COUNTER BY ID ------------------------
export const apiGetCounterById = async (id: number) => {
  try {
    const res = await satellite.get<APIBaseResponse<ICounter>>(
      `${API_BASE_PATH}/${id}`
    );
    return res.data;
  } catch (error) {
    return errorMessage<ICounter>(error);
  }
};

// ------------------------ CREATE COUNTER ------------------------
export const apiCreateCounter = async (data: ICreateCounterRequest) => {
  try {
    const res = await satellite.post<APIBaseResponse<ICounter>>(
      `${API_BASE_PATH}/create`,
      data
    );
    return res.data;
  } catch (error) {
    return errorMessage<ICounter>(error);
  }
};

// ------------------------ UPDATE COUNTER ------------------------
export const apiUpdateCounter = async (id: number, data: IUpdateCounterRequest) => {
  try {
    const res = await satellite.put<APIBaseResponse<ICounter>>(
      `${API_BASE_PATH}/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    return errorMessage<ICounter>(error);
  }
};

// ------------------------ DELETE COUNTER ------------------------
export const apiDeleteCounter = async (id: number) => {
  try {
    const res = await satellite.delete<APIBaseResponse<{ success: boolean }>>(
      `${API_BASE_PATH}/${id}`
    );
    return res.data;
  } catch (error) {
    return errorMessage<{ success: boolean }>(error);
  }
};