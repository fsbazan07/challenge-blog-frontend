import { get, patch } from "../http/client";
import type {
  ChangePasswordRequest,
  UpdateMeRequest,
  UserMe,

} from "./users.types";

export const UsersService = {
  async me(): Promise<UserMe> {
    const data = await get<UserMe>("/users/me");
    return data;
  },

  async updateMe(payload: UpdateMeRequest): Promise<UserMe> {
    const data = await patch<UserMe, UpdateMeRequest>("/users/me", payload);
    return data;
  },

  async changePassword(payload: ChangePasswordRequest): Promise<{ ok: true }> {
    return patch<{ ok: true }, ChangePasswordRequest>(
      "/users/me/password",
      payload
    );
  },

  async deactivateMe(): Promise<{ ok: true }> {
    return patch<{ ok: true }, undefined>("/users/me/deactivate");
  },
};
