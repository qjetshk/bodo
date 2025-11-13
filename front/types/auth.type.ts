import { RegisterLoginForm } from "./login-reg-form.type";

export interface User {
  id: number;
  email: string;
  nickName: string;
  avatarUrl: string;
  password: string
  createdAt: Date
  updatedAt: Date
}

export type RegisterRequest = RegisterLoginForm;

export type LoginRequest = Omit<RegisterLoginForm, "nickName">;

export interface AuthResponse {
  accessToken: string;
  message: string
  user?: User;
}
