import { format, isValid, parseISO, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";

const getValidDate = (date: Date | string | undefined | null): Date | null => {
  if (!date) return null;

  let parsedDate: Date;

  if (typeof date === "string") {
    if (date.endsWith("Z")) {
      parsedDate = addHours(parseISO(date), 3);
    } else {
      parsedDate = parseISO(date);
    }
  } else {
    parsedDate = date;
  }

  return isValid(parsedDate) ? parsedDate : null;
};

export const formatDate = (date: Date | string | undefined | null): string => {
  const validDate = getValidDate(date);
  if (!validDate) return "N/A";

  return format(validDate, "dd/MM/yyyy", { locale: ptBR });
};

export const formatDateForSearch = (date: Date | string): string => {
  const validDate = getValidDate(date);
  if (!validDate) return "";

  return format(validDate, "dd/MM/yyyy", { locale: ptBR });
};

export const formatDateForEditInput = (date: any): string => {
  if (!date) return "";

  if (typeof date === "string" && date.endsWith("Z")) {
    const d = new Date(date);
    d.setDate(d.getDate());
    return d.toISOString().split("T")[0];
  }

  const d = new Date(date);
  return d.toISOString().split("T")[0];
};
