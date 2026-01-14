import { http } from "../http/client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  AuthUser,
  MeResponse,
} from "./auth.types";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const AuthService = {
  // ---------------------------
  // API calls
  // ---------------------------
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>("/auth/login", payload);
    console.log("Login response data:", data);
    if (data.accessToken) this.saveSession(data.accessToken, data.refreshToken);

    return data;
  },

  async register(payload: RegisterRequest): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>("/auth/register", payload);
    if (data.accessToken) this.saveSession(data.accessToken, data.refreshToken);

    return data;
  },

  async refresh(refreshToken: string) {
    const { data } = await http.post<{
      accessToken: string;
      refreshToken: string;
    }>("/auth/refresh", { refreshToken });

    if (data.accessToken) this.saveSession(data.accessToken, data.refreshToken);
    return data;
  },


  async me(): Promise<AuthUser> {
    const { data } = await http.get<MeResponse>("/auth/me");
    return data.user;
  },

  // ---------------------------
  // Session helpers
  // ---------------------------
  saveSession(accessToken: string, refreshToken?: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
  },

  clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  async logout(): Promise<void> {
    await http.post("/auth/logout");
    this.clearSession();
  },
};
