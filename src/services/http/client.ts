import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { tokenStorage } from "./storage";
import { normalizeApiError } from "./errors";
import type { RefreshResponse } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

type RetryConfig = AxiosRequestConfig & { _retry?: boolean };

export const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

http.interceptors.request.use((config) => {
  const access = tokenStorage.getAccess();
  if (access) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function enqueueRefresh(cb: (token: string | null) => void) {
  refreshQueue.push(cb);
}

function resolveRefreshQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) return null;

  try {
    const res = await axios.post<RefreshResponse>(
      `${BASE_URL}/auth/refresh`,
      { refreshToken },
      { timeout: 15000, headers: { "Content-Type": "application/json" } }
    );

    const { accessToken, refreshToken: newRefresh } = res.data;

    tokenStorage.setAccess(accessToken);
    tokenStorage.setRefresh(newRefresh);

    return accessToken;
  } catch (e) {
    // si falla refresh, no lo dejes “crudo”
    throw normalizeApiError(e);
  }
}

http.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err) => {
    const status = err?.response?.status;
    const original = err.config as RetryConfig | undefined;

    if (!original) throw normalizeApiError(err);

    if (status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          enqueueRefresh((token) => {
            if (!token) return reject(normalizeApiError(err));
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${token}`;
            resolve(http(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const token = await refreshAccessToken();
        isRefreshing = false;
        resolveRefreshQueue(token);

        if (!token) {
          tokenStorage.clear();
          throw normalizeApiError(err);
        }

        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return http(original);
      } catch (refreshErr) {
        isRefreshing = false;
        resolveRefreshQueue(null);
        tokenStorage.clear();
        throw normalizeApiError(refreshErr);
      }
    }

    throw normalizeApiError(err);
  }
);

export async function get<T>(url: string, config?: AxiosRequestConfig) {
  const { data } = await http.get<T>(url, config);
  return data;
}
export async function post<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
) {
  const { data } = await http.post<T>(url, body, config);
  return data;
}
export async function put<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
) {
  const { data } = await http.put<T>(url, body, config);
  return data;
}
export async function patch<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
) {
  const { data } = await http.patch<T>(url, body, config);
  return data;
}
export async function del<T>(url: string, config?: AxiosRequestConfig) {
  const { data } = await http.delete<T>(url, config);
  return data;
}
