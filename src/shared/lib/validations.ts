import { z } from "zod";

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

// Email validation schema
const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

// Name validation schema
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

// Signup form validation schema
export const signupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login form validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// User creation API schema (for backend validation)
export const createUserSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Types
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
