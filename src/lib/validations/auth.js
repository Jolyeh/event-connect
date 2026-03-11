import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  npi: z
    .string()
    .length(10, "Le NPI doit contenir exactement 10 chiffres")
    .regex(/^\d+$/, "Le NPI doit contenir uniquement des chiffres"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  role: z.enum(["ORGANIZER", "ADMIN"]).optional().default("ORGANIZER"),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Adresse email invalide"),
});

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, "Token requis"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z
    .string()
    .min(6, "La confirmation du mot de passe est requise"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Mot de passe actuel requis"),
  newPassword: z
    .string()
    .min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z
    .string()
    .min(6, "La confirmation du mot de passe est requise"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});