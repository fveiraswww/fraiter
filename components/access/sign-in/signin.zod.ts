import * as z from "zod";

export const SignInSchema = z.object({
  email: z.string({required_error: "Email requerido."}).email(),
  password: z
    .string({required_error: "Contraseña requerida."})
    .min(8, {message: "La contraseña debe tener al menos 8 caracteres."}),
});
