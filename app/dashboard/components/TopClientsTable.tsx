"use client";

import { motion } from "framer-motion";
import { TopClient } from "../types/analytics.types";

interface Props {
  data: TopClient[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default function TopClientsTable({ data }: Props) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Top Clientes Devedores</h3>
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                #
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Dívida Total
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Vencidos
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Pendentes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  Nenhum cliente devedor encontrado
                </td>
              </tr>
            ) : (
              data.map((client, index) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-400 font-medium">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-200 font-medium">{client.name}</td>
                  <td className="px-4 py-3 text-sm text-red-400 font-semibold">
                    {formatCurrency(client.totalDebt)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-red-900/30 text-red-400 border border-red-700/40">
                      {client.overdueCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-700/40">
                      {client.pendingCount}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
