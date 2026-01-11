import axios, { AxiosError } from "axios";
import type { ApiError, ErrorResponseDto } from "./types";

function asMessage(msg: unknown): string {
  if (typeof msg === "string") return msg;
  if (Array.isArray(msg)) return msg.filter(Boolean).join(" • ");
  return "Ocurrió un error";
}

export function normalizeApiError(err: unknown): ApiError {
  if (!axios.isAxiosError(err)) {
    return { status: 0, message: "Error inesperado", details: err };
  }

  const ax = err as AxiosError<ErrorResponseDto>;
  const status = ax.response?.status ?? 0;
  const data = ax.response?.data;

  const msg =
    asMessage(data?.message) ||
    ax.message ||
    "No se pudo completar la solicitud";

  return {
    status,
    message: msg,
    details: data ?? ax.toJSON?.(),
  };
}
