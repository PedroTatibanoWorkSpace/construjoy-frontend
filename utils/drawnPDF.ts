import jsPDF from 'jspdf';
import { formatDate } from './format';
import { Customer } from '../types';

export function generateCustomerPDF(customer: Customer) {
  const doc = new jsPDF();
  const currentDate = new Date();

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`Relatório de Compras a Crédito Pendentes`, 10, 10);
  doc.setFontSize(14);
  doc.text(`Cliente: ${customer.fullName}`, 10, 20);
  doc.text(`Data do Relatório: ${formatDate(currentDate)}`, 10, 30);

  let y = 50;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(200, 200, 200);
  doc.rect(10, y, 190, 10, 'F');
  doc.text('Descrição', 12, y + 7);
  doc.text('Valor (R$)', 70, y + 7);
  doc.text('Data da Compra', 110, y + 7);
  doc.text('Vencimento', 150, y + 7);
  doc.text('Status', 180, y + 7);

  y += 15;
  let totalPendente = 0;

  customer.purchases.forEach(purchase => {
    if (purchase.status === 'pending') {
      const isOverdue = new Date(purchase.dueDate) < currentDate;
      const statusText = isOverdue ? 'Atrasado' : 'Pendente';
      const statusColor: [number, number, number] = isOverdue ? [255, 0, 0] : [0, 0, 0];

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(purchase.description, 12, y);
      doc.text(`R$ ${purchase.amount.toFixed(2)}`, 90, y, { align: 'right' });
      doc.text(formatDate(purchase.purchaseDate), 110, y);
      doc.text(formatDate(purchase.dueDate), 150, y);
      doc.setTextColor(...statusColor);
      doc.text(statusText, 180, y);

      totalPendente += purchase.amount;
      y += 10;
    }
  });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 100, 0);
  doc.text(`Total Pendente: R$ ${totalPendente.toFixed(2)}`, 10, y + 20);

  doc.save(`relatorio_compras_${customer.fullName}.pdf`);
}
