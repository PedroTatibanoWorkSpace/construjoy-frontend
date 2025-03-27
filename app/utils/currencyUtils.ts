export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatValueToNumber = (value: string): string => {
  const cleanValue = value.replace(/[^\d,]/g, "");

  const parts = cleanValue.split(",");
  if (parts.length > 1) {
    return `${parts[0]},${parts[1].slice(0, 2)}`;
  }

  return cleanValue;
};
