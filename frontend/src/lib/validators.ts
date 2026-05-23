import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8).max(15),
  classLevel: z.string().min(1),
  password: z.string().min(8),
  captcha: z.literal("ADYAPAN")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  captcha: z.literal("ADYAPAN")
});

export const leadSchema = z.object({
  type: z.enum(["demo", "school", "newsletter"]),
  name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  school: z.string().optional(),
  city: z.string().optional(),
  message: z.string().optional(),
  classLevel: z.string().optional(),
  interest: z.string().optional()
});

export const paymentOrderSchema = z.object({
  plan: z.string().min(2),
  amount: z.number().positive(),
  userEmail: z.string().email()
});

export const paymentVerifySchema = z.object({
  orderId: z.string().min(2),
  paymentId: z.string().min(2),
  signature: z.string().min(2),
  plan: z.string().min(2),
  userEmail: z.string().email()
});
