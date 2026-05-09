import apiClient from "@/lib/api-client"
import { LoginRequest, LoginResponse } from "@/types/auth"

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/users/login", credentials)
    return response.data
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  },
}
