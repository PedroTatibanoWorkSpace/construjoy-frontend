import jsPDF from "jspdf";
import { formatDate } from "./dateUtils";
import { Customer } from "../customers/entities/customers.entity";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export function generateCustomerPDF(customer: Customer) {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const now = new Date();
  const margin = 18;

  const colors = {
    primary: [30, 64, 175] as [number, number, number],     // blue-800
    primaryLight: [59, 130, 246] as [number, number, number], // blue-500
    dark: [15, 23, 42] as [number, number, number],           // slate-900
    text: [30, 41, 59] as [number, number, number],           // slate-800
    muted: [100, 116, 139] as [number, number, number],       // slate-500
    light: [241, 245, 249] as [number, number, number],       // slate-100
    white: [255, 255, 255] as [number, number, number],
    red: [220, 38, 38] as [number, number, number],
    amber: [180, 130, 10] as [number, number, number],
    green: [22, 163, 74] as [number, number, number],
    border: [226, 232, 240] as [number, number, number],      // slate-200
  };

  const pendingReceivables = customer.receivables?.filter(
    (r) => r.paymentStatus && r.paymentStatus !== "Pago"
  ) || [];

  let totalPendente = 0;
  let totalAtrasado = 0;
  pendingReceivables.forEach((r) => {
    if (r.paymentStatus === "Atrasado") totalAtrasado += r.value;
    else totalPendente += r.value;
  });
  const totalGeral = totalPendente + totalAtrasado;

  // ============ HEADER ============
  // Thin accent line at very top
  doc.setFillColor(...colors.primaryLight);
  doc.rect(0, 0, pw, 4, "F");

  // Company name
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.dark);
  doc.text("ConstruJoy", margin, 20);

  // Subtitle
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.muted);
  doc.text("Sistema de Gestão de Crédito", margin, 26);

  // Report title - right side
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.dark);
  doc.text("RELATÓRIO DE DÉBITOS", pw - margin, 18, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.muted);
  doc.text(`Emitido em ${formatDate(now)}`, pw - margin, 25, { align: "right" });

  // Separator line
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.4);
  doc.line(margin, 32, pw - margin, 32);

  // ============ CLIENT INFO ============
  let y = 42;

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.primaryLight);
  doc.text("DADOS DO CLIENTE", margin, y);

  y += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.dark);
  doc.text(customer.name, margin, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.muted);
  doc.text(`CPF: ${customer.document}`, margin + 80, y);

  y += 6;
  doc.setFontSize(8);
  doc.text(`${customer.email}  •  ${customer.phone}`, margin, y);

  // ============ SUMMARY BOXES ============
  y += 14;

  const boxW = (pw - margin * 2 - 10) / 3;
  const boxH = 18;

  // Box 1: Pendente
  doc.setFillColor(255, 251, 235); // amber-50
  doc.roundedRect(margin, y, boxW, boxH, 2, 2, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.muted);
  doc.text("Pendente", margin + 5, y + 6);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.amber);
  doc.text(formatBRL(totalPendente), margin + 5, y + 14);

  // Box 2: Atrasado
  const x2 = margin + boxW + 5;
  doc.setFillColor(254, 242, 242); // red-50
  doc.roundedRect(x2, y, boxW, boxH, 2, 2, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.muted);
  doc.text("Atrasado", x2 + 5, y + 6);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.red);
  doc.text(formatBRL(totalAtrasado), x2 + 5, y + 14);

  // Box 3: Total
  const x3 = margin + (boxW + 5) * 2;
  doc.setFillColor(239, 246, 255); // blue-50
  doc.roundedRect(x3, y, boxW, boxH, 2, 2, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.muted);
  doc.text("Total em aberto", x3 + 5, y + 6);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.primary);
  doc.text(formatBRL(totalGeral), x3 + 5, y + 14);

  // ============ TABLE ============
  y += boxH + 14;

  // Column positions
  const cols = {
    desc: margin,
    valor: 90,
    compra: 120,
    venc: 148,
    status: 176,
  };

  // Table header
  doc.setFillColor(...colors.dark);
  doc.roundedRect(margin, y, pw - margin * 2, 9, 1.5, 1.5, "F");

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.white);
  doc.text("DESCRIÇÃO", cols.desc + 4, y + 6);
  doc.text("VALOR", cols.valor, y + 6);
  doc.text("COMPRA", cols.compra, y + 6);
  doc.text("VENCIMENTO", cols.venc, y + 6);
  doc.text("STATUS", cols.status, y + 6);

  y += 12;

  // Table rows
  pendingReceivables.forEach((purchase, index) => {
    // Page break check
    if (y > ph - 30) {
      addFooter(doc, pw, ph, margin, colors);
      doc.addPage();
      y = 16;
      // Re-draw header accent
      doc.setFillColor(...colors.primaryLight);
      doc.rect(0, 0, pw, 4, "F");
      y = 20;
    }

    // Alternate row bg
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(margin, y - 4, pw - margin * 2, 9, "F");
    }

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.text);

    // Description
    const desc = purchase.description.length > 30
      ? purchase.description.substring(0, 30) + "..."
      : purchase.description;
    doc.text(desc, cols.desc + 4, y + 2);

    // Value
    doc.setFont("helvetica", "bold");
    doc.text(formatBRL(purchase.value), cols.valor, y + 2);

    // Dates
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.muted);
    doc.text(formatDate(purchase.purchaseDate), cols.compra, y + 2);
    doc.text(formatDate(purchase.validate), cols.venc, y + 2);

    // Status
    const isOverdue = purchase.paymentStatus === "Atrasado";
    const statusText = isOverdue ? "Atrasado" : "Pendente";
    const statusColor = isOverdue ? colors.red : colors.amber;

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...statusColor);
    doc.text(statusText, cols.status, y + 2);

    // Small dot before status
    doc.setFillColor(...statusColor);
    doc.circle(cols.status - 3, y + 1, 1.2, "F");

    y += 9;
  });

  // Bottom line under table
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pw - margin, y);

  // Record count
  y += 8;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.muted);
  doc.text(`${pendingReceivables.length} registro(s)`, margin, y);

  // ============ FOOTER ============
  addFooter(doc, pw, ph, margin, colors);

  // Save
  doc.save(`ConstruJoy_Debitos_${customer.name.replace(/\s+/g, "_")}.pdf`);
}

function addFooter(
  doc: jsPDF,
  pw: number,
  ph: number,
  margin: number,
  colors: Record<string, [number, number, number]>
) {
  const fy = ph - 12;

  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.3);
  doc.line(margin, fy - 3, pw - margin, fy - 3);

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.muted);
  doc.text("ConstruJoy  •  Sistema de Gestão de Crédito", margin, fy);
  doc.text("Documento gerado automaticamente", pw - margin, fy, { align: "right" });
}
