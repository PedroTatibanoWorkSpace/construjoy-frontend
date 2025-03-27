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
