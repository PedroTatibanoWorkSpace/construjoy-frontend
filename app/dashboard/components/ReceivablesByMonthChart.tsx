"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ReceivableByMonth } from "../types/analytics.types";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  data: ReceivableByMonth[];
}

const COLORS: Record<string, string> = {
  Pago: "#34d399",
  Pendente: "#facc15",
  Atrasado: "#f87171",
};

export default function ReceivablesByMonthChart({ data }: Props) {
  const grouped: Record<string, Record<string, number>> = {};

  data.forEach((item) => {
    const monthKey = item.month;
    if (!grouped[monthKey]) grouped[monthKey] = {};
    grouped[monthKey][item.status] = item.total;
  });

  const chartData = Object.entries(grouped)
    .map(([month, statuses]) => {
      let label: string;
      try {
        label = format(parseISO(month), "MMM/yy", { locale: ptBR });
      } catch {
        label = month;
      }
      return {
        month: label,
        Pago: statuses["Pago"] || 0,
        Pendente: statuses["Pendente"] || 0,
        Atrasado: statuses["Atrasado"] || 0,
      };
    })
    .sort((a, b) => a.month.localeCompare(b.month));

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(value);

  return (
    <div className="rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Recebíveis por Mês</h3>
      {chartData.length === 0 ? (
        <p className="text-gray-400 text-center py-10">Sem dados para exibir</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={formatCurrency} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#e2e8f0" }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Bar dataKey="Pago" fill={COLORS.Pago} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Pendente" fill={COLORS.Pendente} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Atrasado" fill={COLORS.Atrasado} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
