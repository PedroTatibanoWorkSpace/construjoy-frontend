"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { OverdueAgingItem } from "../types/analytics.types";

interface Props {
  data: OverdueAgingItem[];
}

const RANGE_COLORS: Record<string, string> = {
  "1-30": "#facc15",
  "31-60": "#fb923c",
  "61-90": "#f87171",
  "90+": "#dc2626",
};

const RANGE_LABELS: Record<string, string> = {
  "1-30": "1-30 dias",
  "31-60": "31-60 dias",
  "61-90": "61-90 dias",
  "90+": "90+ dias",
};

export default function OverdueAgingChart({ data }: Props) {
  const chartData = data.map((item) => ({
    ...item,
    label: RANGE_LABELS[item.range] || item.range,
  }));

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(value);

  return (
    <div className="rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Aging de Inadimplência</h3>
      {chartData.every((d) => d.count === 0) ? (
        <p className="text-gray-400 text-center py-10">Sem inadimplências registradas</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" fontSize={12} tickFormatter={formatCurrency} />
            <YAxis type="category" dataKey="label" stroke="#9ca3af" fontSize={12} width={90} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#e2e8f0" }}
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                "Valor",
              ]}
            />
            <Bar dataKey="total" radius={[0, 4, 4, 0]} name="Valor">
              {chartData.map((entry) => (
                <Cell key={entry.range} fill={RANGE_COLORS[entry.range] || "#f87171"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
