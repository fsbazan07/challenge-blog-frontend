import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AuthService } from "./auth.service";
import type { LoginRequest, LoginResponse, RegisterRequest, MeResponse } from "./auth.types";

vi.mock("../http/client", () => ({
  http: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import { http } from "../http/client";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

describe("AuthService", () => {
  const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("login: llama POST /auth/login y guarda access/refresh tokens si vienen", async () => {
    const payload: LoginRequest = {
      email: "test@test.com",
      password: "123456",
    };

    const response: LoginResponse = {
      accessToken: "access.jwt",
      refreshToken: "refresh.jwt",
    } as LoginResponse;

    vi.mocked(http.post).mockResolvedValue({ data: response });

    const res = await AuthService.login(payload);

    expect(http.post).toHaveBeenCalledWith("/auth/login", payload);
    expect(res).toBe(response);

    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe("access.jwt");
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe("refresh.jwt");

    // evita ruido en consola
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("login: si NO viene accessToken, no guarda sesión", async () => {
    const payload: LoginRequest = {
      email: "test@test.com",
      password: "123456",
    };

    const response: LoginResponse = {} as LoginResponse;

    vi.mocked(http.post).mockResolvedValue({ data: response });

    const res = await AuthService.login(payload);

    expect(http.post).toHaveBeenCalledWith("/auth/login", payload);
    expect(res).toBe(response);

    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
  });

  it("register: llama POST /auth/register y guarda tokens si vienen", async () => {
    const payload: RegisterRequest = {
      name: "Test",
      email: "test@test.com",
      password: "123456",
    } as RegisterRequest;

    const response: LoginResponse = {
      accessToken: "access.jwt",
      refreshToken: "refresh.jwt",
    } as LoginResponse;

    vi.mocked(http.post).mockResolvedValue({ data: response });

    const res = await AuthService.register(payload);

    expect(http.post).toHaveBeenCalledWith("/auth/register", payload);
    expect(res).toBe(response);

    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe("access.jwt");
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe("refresh.jwt");
  });

  it("refresh: llama POST /auth/refresh con refreshToken y guarda tokens", async () => {
    const response = { accessToken: "new.access", refreshToken: "new.refresh" };

    vi.mocked(http.post).mockResolvedValue({ data: response });

    const res = await AuthService.refresh("old.refresh");

    expect(http.post).toHaveBeenCalledWith("/auth/refresh", { refreshToken: "old.refresh" });
    expect(res).toBe(response);

    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe("new.access");
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe("new.refresh");
  });

  it("me: llama GET /auth/me y retorna data.user", async () => {
    const response: MeResponse = {
      user: {
        id: "u1",
        name: "Test",
        email: "test@test.com",
      },
    } as MeResponse;

    vi.mocked(http.get).mockResolvedValue({ data: response });

    const res = await AuthService.me();

    expect(http.get).toHaveBeenCalledWith("/auth/me");
    expect(res).toEqual(response.user);
  });

  it("logout: llama POST /auth/logout y limpia sesión", async () => {
    // pre-carga sesión
    localStorage.setItem(ACCESS_TOKEN_KEY, "access.jwt");
    localStorage.setItem(REFRESH_TOKEN_KEY, "refresh.jwt");

    vi.mocked(http.post).mockResolvedValue({ data: {} });

    await AuthService.logout();

    expect(http.post).toHaveBeenCalledWith("/auth/logout");
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
  });
});
