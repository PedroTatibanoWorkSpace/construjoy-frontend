import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FinancialSummaryCards from "../components/FinancialSummaryCards";
import { FinancialSummary } from "../types/analytics.types";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("FinancialSummaryCards", () => {
  const mockData: FinancialSummary = {
    totalReceivables: 10000,
    totalPaid: 6000,
    totalPending: 2500,
    totalOverdue: 1500,
    totalCount: 20,
    collectionRate: 60,
  };

  it("should render all 5 KPI cards", () => {
    render(<FinancialSummaryCards data={mockData} />);

    expect(screen.getByText("Total Recebíveis")).toBeInTheDocument();
    expect(screen.getByText("Total Recebido")).toBeInTheDocument();
    expect(screen.getByText("Pendente")).toBeInTheDocument();
    expect(screen.getByText("Vencido")).toBeInTheDocument();
    expect(screen.getByText("Taxa de Cobrança")).toBeInTheDocument();
  });

  it("should display formatted currency values", () => {
    render(<FinancialSummaryCards data={mockData} />);

    expect(screen.getByText("R$ 10.000,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 6.000,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 2.500,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 1.500,00")).toBeInTheDocument();
  });

  it("should display collection rate percentage", () => {
    render(<FinancialSummaryCards data={mockData} />);

    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("should handle zero values", () => {
    const zeroData: FinancialSummary = {
      totalReceivables: 0,
      totalPaid: 0,
      totalPending: 0,
      totalOverdue: 0,
      totalCount: 0,
      collectionRate: 0,
    };

    render(<FinancialSummaryCards data={zeroData} />);

    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
