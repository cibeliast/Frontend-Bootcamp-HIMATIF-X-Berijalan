"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  apiCreateCounter,
  apiDeleteCounter,
  apiGetAllCounters,
  apiGetCounterById,
  apiUpdateCounter,
} from "./api.service";
import {
  ICounter,
  ICreateCounterRequest,
  IUpdateCounterRequest,
} from "@/interfaces/services/counter.interface";
import toast from "react-hot-toast";

export const COUNTER_KEYS = {
  all: ["counters"] as const,
  byId: (id: number) => ["counters", id] as const,
};

// ------------------------ GET ALL COUNTERS ------------------------
export const useGetAllCounters = () => {
  return useQuery({
    queryKey: [COUNTER_KEYS.all],
    queryFn: () => apiGetAllCounters(),
    refetchOnWindowFocus: false,
  });
};

// ------------------------ GET COUNTER BY ID ------------------------
export const useGetCounterById = (id: number) => {
  return useQuery({
    queryKey: [COUNTER_KEYS.byId(id)],
    queryFn: () => apiGetCounterById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

// ------------------------ CREATE COUNTER ------------------------
export const useCreateCounter = () => {
  return useMutation({
    mutationFn: (data: ICreateCounterRequest) => apiCreateCounter(data),
    onSuccess: (response) => {
      if (response?.error) {
        toast.error(response.error.message || "Failed to create counter");
        return;
      }

      if (response?.status) {
        toast.success("Counter created successfully");
      } else {
        toast.error(response?.message || "Failed to create counter");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create counter");
    },
  });
};

// ------------------------ UPDATE COUNTER ------------------------
export const useUpdateCounter = () => {
  return useMutation({
    mutationFn: (data: IUpdateCounterRequest) => {
      if (!data.id) throw new Error("Counter ID is required");
      const { id, ...rest } = data;
      return apiUpdateCounter(id, rest);
    },
    onSuccess: (response) => {
      if (response?.error) {
        toast.error(response.error.message || "Failed to update counter");
        return;
      }

      if (response?.status) {
        toast.success("Counter updated successfully");
      } else {
        toast.error(response?.message || "Failed to update counter");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update counter");
    },
  });
};

// ------------------------ DELETE COUNTER ------------------------
export const useDeleteCounter = () => {
  return useMutation({
    mutationFn: (id: number) => apiDeleteCounter(id),
    onSuccess: (response) => {
      if (response?.error) {
        toast.error(response.error.message || "Failed to delete counter");
        return;
      }

      if (response?.status) {
        toast.success("Counter deleted successfully");
      } else {
        toast.error(response?.message || "Failed to delete counter");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete counter");
    },
  });
};