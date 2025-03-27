import { CreditPurchase, Customer } from './types';
import { formatDate, formatCurrency } from './utils';
import { Toaster } from "@/components/ui/toaster";

// Mock data - substituir por chamadas API reais
const mockCustomers: Customer[] = [
  {
    id: '1',
    fullName: 'João Silva',
    cpf: '123.456.789-00',
    address: 'Rua Principal, 123',
    phone: '(11) 98765-4321',
    email: 'joao@exemplo.com',
    registrationDate: new Date('2023-01-01'),
  },
];

const mockPurchases: CreditPurchase[] = [
  {
    id: '1',
    customerId: '1',
    amount: 1000,
    description: 'Compra de materiais',
    purchaseDate: new Date('2023-08-01'),
    dueDate: new Date('2023-09-05'),
    status: 'pending',
  },
];

const getStatusText = (status: string) => {
  switch (status) {
    case 'paid':
      return 'Pago';
    case 'pending':
      return 'Pendente';
    case 'overdue':
      return 'Atrasado';
    default:
      return status;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-900 text-green-200';
    case 'pending':
      return 'bg-yellow-900 text-yellow-200';
    case 'overdue':
      return 'bg-red-900 text-red-200';
    default:
      return 'bg-gray-900 text-gray-200';
  }
};

export default function Home() {
  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Painel de Controle de Crédito</h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="dark-card rounded-lg overflow-hidden shadow">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-200">Créditos Vencidos</h3>
              <p className="mt-1 text-3xl font-semibold text-red-400">
                {mockPurchases.filter(p => p.status === 'overdue').length}
              </p>
            </div>
          </div>

          <div className="dark-card rounded-lg overflow-hidden shadow">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-200">Vencimentos este Mês</h3>
              <p className="mt-1 text-3xl font-semibold text-yellow-400">
                {mockPurchases.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>

          <div className="dark-card rounded-lg overflow-hidden shadow">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-200">Total de Clientes</h3>
              <p className="mt-1 text-3xl font-semibold text-blue-400">
                {mockCustomers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="dark-card shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Atividade Recente</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Vencimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {mockPurchases.map((purchase) => {
                    const customer = mockCustomers.find(c => c.id === purchase.customerId);
                    return (
                      <tr key={purchase.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                          {customer?.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatCurrency(purchase.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(purchase.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(purchase.status)}`}>
                            {getStatusText(purchase.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}