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


export const formatDateForSearch = (date: Date): string => {
  return new Date(date).toLocaleDateString('pt-BR');
};


export const formatValueToNumber = (value: string): string => {

  const cleanValue = value.replace(/[^\d,]/g, '');

  const parts = cleanValue.split(',');
  if (parts.length > 1) {
    return `${parts[0]},${parts[1].slice(0, 2)}`;
  }
  
  return cleanValue;
};

export const getStatusClass = (status: string) => {
  switch (status) {
    case "Pago":
      return "bg-green-600 text-white";
    case "Pendente":
      return "bg-yellow-500 text-black";
    case "Atrasado":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};