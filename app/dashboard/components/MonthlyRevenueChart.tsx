"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { MonthlyRevenue } from "../types/analytics.types";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  data: MonthlyRevenue[];
}

export default function MonthlyRevenueChart({ data }: Props) {
  const chartData = data.map((item) => {
    let label: string;
    try {
      label = format(parseISO(item.month), "MMM/yy", { locale: ptBR });
    } catch {
      label = item.month;
    }
    return {
      month: label,
      total: item.total,
      count: item.count,
    };
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(value);

  return (
    <div className="rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Receita Mensal (Pagamentos)</h3>
      {chartData.length === 0 ? (
        <p className="text-gray-400 text-center py-10">Sem dados para exibir</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={formatCurrency} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#e2e8f0" }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              name="Receita"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
