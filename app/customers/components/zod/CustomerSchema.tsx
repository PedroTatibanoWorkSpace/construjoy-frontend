import {z} from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  document: z.string().min(11, "Documento deve ter no mínimo 11 caracteres"),
  phone: z.string().min(10, "Telefone deve ter no mínimo 10 caracteres"),
  email: z.string().email("Email inválido"),
});