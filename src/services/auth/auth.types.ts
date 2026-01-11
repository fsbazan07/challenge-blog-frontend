export type UserRoleCode = "admin" | "blogger";

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  role?: UserRoleCode;
};

export type MeResponse = {
  user: AuthUser;
};
