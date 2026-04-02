"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ReceivableByStatus } from "../types/analytics.types";

interface Props {
  data: ReceivableByStatus[];
}

const COLORS: Record<string, string> = {
  Pago: "#34d399",
  Pendente: "#facc15",
  Atrasado: "#f87171",
};

const LABELS: Record<string, string> = {
  Pago: "Pago",
  Pendente: "Pendente",
  Atrasado: "Atrasado",
};

export default function ReceivablesByStatusChart({ data }: Props) {
  const chartData = data.map((item) => ({
    name: LABELS[item.status] || item.status,
    value: item.total,
    count: item.count,
  }));

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <div className="rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Status</h3>
      {chartData.length === 0 ? (
        <p className="text-gray-400 text-center py-10">Sem dados para exibir</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name] || "#8884d8"}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
              itemStyle={{ color: "#e2e8f0" }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
