import { describe, it, expect, vi, beforeEach } from "vitest";

import type {
  ChangePasswordRequest,
  UpdateMeRequest,
  UserMe,
} from "./users.types";

vi.mock("../http/client", () => ({
  get: vi.fn(),
  patch: vi.fn(),
}));

import { get, patch } from "../http/client";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("me: llama GET /users/me y retorna data", async () => {
    const response: UserMe = {
      id: "u1",
      name: "Test",
      email: "test@test.com",
    } as UserMe;

    vi.mocked(get).mockResolvedValue(response);

    const res = await UsersService.me();

    expect(get).toHaveBeenCalledWith("/users/me");
    expect(res).toBe(response);
  });

  it("updateMe: llama PATCH /users/me con payload y retorna data", async () => {
    const payload: UpdateMeRequest = {
      name: "Nuevo nombre",
    } as UpdateMeRequest;

    const response: UserMe = {
      id: "u1",
      name: "Nuevo nombre",
      email: "test@test.com",
    } as UserMe;

    vi.mocked(patch).mockResolvedValue(response);

    const res = await UsersService.updateMe(payload);

    expect(patch).toHaveBeenCalledWith("/users/me", payload);
    expect(res).toBe(response);
  });

  it("changePassword: llama PATCH /users/me/password con payload y retorna { ok: true }", async () => {
    const payload: ChangePasswordRequest = {
      currentPassword: "old",
      newPassword: "new",
    } as ChangePasswordRequest;

    const response = { ok: true as const };

    vi.mocked(patch).mockResolvedValue(response);

    const res = await UsersService.changePassword(payload);

    expect(patch).toHaveBeenCalledWith("/users/me/password", payload);
    expect(res).toEqual({ ok: true });
  });

  it("deactivateMe: llama PATCH /users/me/deactivate sin payload y retorna { ok: true }", async () => {
    const response = { ok: true as const };

    vi.mocked(patch).mockResolvedValue(response);

    const res = await UsersService.deactivateMe();

    // Nota: tu patch genérico se llama con solo 1 argumento en este caso
    expect(patch).toHaveBeenCalledWith("/users/me/deactivate");
    expect(res).toEqual({ ok: true });
  });
});
