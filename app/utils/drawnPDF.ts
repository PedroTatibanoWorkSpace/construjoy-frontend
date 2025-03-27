import jsPDF from "jspdf";
import { formatDate } from "./dateUtils";
import { Customer } from "../customers/entities/customers.entity";

export function generateCustomerPDF(customer: Customer) {
  const doc = new jsPDF();
  const currentDate = new Date();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`Relatório de Compras a Crédito Pendentes`, 10, 10);
  doc.setFontSize(14);
  doc.text(`Cliente: ${customer.name}`, 10, 20);
  doc.text(`Data do Relatório: ${formatDate(currentDate)}`, 10, 30);

  let y = 50;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(200, 200, 200);
  doc.rect(10, y, 190, 10, "F");
  doc.text("Descrição", 12, y + 7);
  doc.text("Valor (R$)", 70, y + 7);
  doc.text("Data da Compra", 110, y + 7);
  doc.text("Vencimento", 150, y + 7);
  doc.text("Status", 180, y + 7);

  y += 15;
  let totalPendente = 0;

  customer.receivables?.forEach((purchase) => {
    if (purchase.paymentStatus === "Pendente") {
      const statusText =
        purchase.paymentStatus !== "Pendente" ? "Atrasado" : "Pendente";
      const statusColor: [number, number, number] =
        purchase.paymentStatus !== "Pendente" ? [255, 0, 0] : [153, 102, 0];

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(purchase.description, 12, y);
      doc.text(`R$ ${purchase.value.toFixed(2)}`, 90, y, { align: "right" });
      doc.text(formatDate(purchase.purchaseDate), 110, y);
      doc.text(formatDate(purchase.validate), 150, y);
      doc.setTextColor(...statusColor);
      doc.text(statusText, 180, y);

      totalPendente += purchase.value;
      y += 10;
    }
  });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 100, 0);
  doc.text(`Total Pendente: R$ ${totalPendente.toFixed(2)}`, 10, y + 20);

  doc.save(`relatorio_compras_${customer.name}.pdf`);
}
