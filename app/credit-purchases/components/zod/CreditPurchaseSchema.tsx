import z from "zod";

export const creditPurchaseSchema = z.object({
  clientId: z.string({
    required_error: "Cliente é obrigatório",
  }).min(1, "Cliente é obrigatório"),
  
  value: z.number({
    required_error: "Valor é obrigatório",
  }).min(0.01, "Valor deve ser maior que zero"),

  description: z.string({
    required_error: "Descrição é obrigatória",
  }).min(1, "Descrição é obrigatória"),
  
  validate: z.date({
    required_error: "Data de vencimento é obrigatória",
  }),
  
  purchaseDate: z.date({
    required_error: "Data da compra é obrigatória",
  }),
  
});