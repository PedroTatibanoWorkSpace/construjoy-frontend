import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomerList from "../CustomerList";

// Mock the query hooks
jest.mock("../../service/reactQuery/customer.query", () => ({
  useCustomers: () => ({
    data: [
      {
        id: "1",
        name: "João Silva",
        email: "joao@email.com",
        phone: "(11) 99999-9999",
        document: "123.456.789-00",
        status: "Active",
        createdAt: "2025-01-01",
      },
      {
        id: "2",
        name: "Maria Santos",
        email: "maria@email.com",
        phone: "(11) 88888-8888",
        document: "987.654.321-00",
        status: "Active",
        createdAt: "2025-02-01",
      },
    ],
    isLoading: false,
    error: null,
  }),
  useCreateCustomer: () => ({ mutate: jest.fn() }),
  useUpdateCustomer: () => ({ mutate: jest.fn() }),
  useDeleteCustomer: () => ({ mutate: jest.fn() }),
}));

jest.mock("../../../credit-purchases/service/reactQuery/creditPurchase.query", () => ({
  useCreditPurchases: () => ({
    data: [],
    isLoading: false,
  }),
  usePaidMultipleAccounts: () => ({ mutate: jest.fn(), isPending: false }),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("CustomerList", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it("should render customer names", () => {
    renderWithProvider(<CustomerList />);

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
  });

  it("should render customer documents", () => {
    renderWithProvider(<CustomerList />);

    expect(screen.getByText("123.456.789-00")).toBeInTheDocument();
    expect(screen.getByText("987.654.321-00")).toBeInTheDocument();
  });

  it("should render the search input", () => {
    renderWithProvider(<CustomerList />);

    expect(screen.getByPlaceholderText("Buscar por nome, documento ou email...")).toBeInTheDocument();
  });
});
