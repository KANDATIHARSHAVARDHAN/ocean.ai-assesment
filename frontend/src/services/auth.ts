import type { UserCredentials } from "../types";
import { apiRequest } from "./api";

export function register(credentials: UserCredentials) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function login(credentials: UserCredentials) {
  return apiRequest<{ access_token: string; expires_at: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}


