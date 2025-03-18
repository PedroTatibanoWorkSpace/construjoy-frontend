export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: Date | undefined | null): string => {
  if (!date || isNaN(new Date(date).getTime())) {
    return "N/A";
  }
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};