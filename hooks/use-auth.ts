import { authService } from "@/services/auth.service"
import { LoginRequest, LoginResponse } from "@/types/auth"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "@/i18n/routing"

export const useLogin = () => {
  const router = useRouter()

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: authService.login,
    onSuccess: (response) => {
      if (response.success) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        router.push("/dashboard")
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error)
      alert(error.response?.data?.message || "Login failed. Please try again.")
    },
  })
}

export const useLogout = () => {
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return { logout }
}
