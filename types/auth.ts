import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export interface User {
  user_id: string;
  vendor_id: string;
  name: string;
  email: string;
  phone: string;
  user_type: string;
  vendor_name: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}
