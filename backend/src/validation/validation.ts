import { z } from 'zod';

const passwordSchema = z.string()
  .min(8) // Minimum length of password
  .regex(/[!@#$%^&*]/, "Password must contain at least one special character") // Regex for special characters
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .trim()

  export const SignupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
  });
  
  export const SigninSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  });