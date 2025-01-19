import * as z from "zod";

export const SignUpSchema = z
  .object({
    email: z.string({required_error: "Email requerido."}).email(),
    password: z.string({required_error: "Contraseña requerida."}).min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    }),

    password_confirmation: z.string().min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no son iguales",
    path: ["password_confirmation"],
  });
