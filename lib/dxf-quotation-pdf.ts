/**
 * DXF Quotation PDF Generator
 * ─────────────────────────────────────────────────────────────────────────────
 * Produces a clean, premium-looking client proposal PDF from the DXF pricing
 * engine data using jsPDF + AutoTable.
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface QuotationPdfRow {
  label: string;
  width: number;
  height: number;
  usedSize: number;
  inch: number;
  pricePerInch: number;
  quantity: number;
  total: number;
}

export interface QuotationPdfData {
  fileName: string;
  unit: string;
  totalDesignWidth?: number;
  totalDesignHeight?: number;
  totalArea?: number;
  detectedLayers?: string[];
  globalPricePerInch: number;
  grandTotal: number;
  totalInches: number;
  rows: QuotationPdfRow[];

  /** Optional company / CRM branding */
  companyName?: string;
  companyTagline?: string;
  quoteRef?: string;
}

// ─── Colour palette ───────────────────────────────────────────────────────────
const C = {
  dark:     [15,  23,  42]  as [number, number, number], // slate-900
  primary:  [79,  70, 229]  as [number, number, number], // indigo-600
  accent:   [139, 92, 246]  as [number, number, number], // violet-500
  emerald:  [16, 185, 129]  as [number, number, number], // emerald-500
  muted:    [100,116, 139]  as [number, number, number], // slate-500
  mutedBg:  [241,245, 249]  as [number, number, number], // slate-100
  white:    [255,255, 255]  as [number, number, number],
  border:   [226,232, 240]  as [number, number, number], // slate-200
  rowEven:  [248,250, 252]  as [number, number, number], // slate-50
  rowOdd:   [255,255, 255]  as [number, number, number],
  totalRow: [238,242, 255]  as [number, number, number], // indigo-50
};

export function generateQuotationPdf(data: QuotationPdfData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW = doc.internal.pageSize.getWidth();   // 210
  const PH = doc.internal.pageSize.getHeight();  // 297
  const M  = 14; // left/right margin

  const company     = data.companyName    ?? "ProjectFlow CRM";
  const tagline     = data.companyTagline ?? "Signage & Printing Industry";
  const quoteDate   = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const quoteRef    = data.quoteRef       ?? `Q-${Date.now().toString().slice(-6)}`;

  let y = 0; // running cursor

  // ── 1. Deep header banner ──────────────────────────────────────────────────
  doc.setFillColor(...C.dark);
  doc.rect(0, 0, PW, 42, "F");

  // Left: company info
  doc.setTextColor(...C.white);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(company, M, 16);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(tagline, M, 22);

  // Right: QUOTATION label + ref/date
  doc.setTextColor(...C.white);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("QUOTATION", PW - M, 16, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`Ref: ${quoteRef}`, PW - M, 22, { align: "right" });
  doc.text(`Date: ${quoteDate}`, PW - M, 27, { align: "right" });

  // Accent bar (indigo bottom of header)
  doc.setFillColor(...C.primary);
  doc.rect(0, 38, PW, 4, "F");

  y = 52;

  // ── 2. Design File Details card ───────────────────────────────────────────
  doc.setFillColor(...C.mutedBg);
  doc.roundedRect(M, y, PW - M * 2, 30, 3, 3, "F");

  // Section title
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.primary);
  doc.text("DESIGN FILE DETAILS", M + 5, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.muted);

  const col1x = M + 5;
  const col2x = M + 65;
  const col3x = M + 125;

  const drawDetailRow = (label: string, value: string, x: number, dy: number) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.dark);
    doc.setFontSize(8.5);
    doc.text(value, x, y + dy);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.muted);
    doc.setFontSize(7);
    doc.text(label, x, y + dy + 4);
  };

  drawDetailRow("Design File", data.fileName.replace(/\\/g, "/").split("/").pop()?.slice(0, 28) ?? data.fileName, col1x, 15);
  drawDetailRow("Design Size",
    data.totalDesignWidth && data.totalDesignHeight
      ? `${data.totalDesignWidth} × ${data.totalDesignHeight} mm`
      : "—",
    col2x, 15
  );
  drawDetailRow("Unit / Letters", `${data.unit.toUpperCase()} · ${data.rows.length} letters`, col3x, 15);

  y += 38;

  // ── 3. Table header label ─────────────────────────────────────────────────
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.dark);
  doc.text("Pricing Breakdown", M, y);

  const ppI = `₹${data.globalPricePerInch}/inch (global rate)`;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.muted);
  doc.text(ppI, PW - M, y, { align: "right" });

  y += 5;

  // ── 4. Pricing table ──────────────────────────────────────────────────────
  const tableHead = [[
    { content: "Letter / Object", styles: { halign: "left" as const } },
    { content: "Width\n(mm)",     styles: { halign: "right" as const } },
    { content: "Height\n(mm)",    styles: { halign: "right" as const } },
    { content: "Used Size\n(mm)", styles: { halign: "right" as const } },
    { content: "Inches",          styles: { halign: "right" as const } },
    { content: "₹/Inch",          styles: { halign: "right" as const } },
    { content: "Qty",             styles: { halign: "center" as const } },
    { content: "Total Price",     styles: { halign: "right" as const } },
  ]];

  const tableBody = data.rows.map((r) => [
    { content: r.label,                            styles: { halign: "left" as const, fontStyle: "bold" as const } },
    { content: r.width.toFixed(1),                 styles: { halign: "right" as const } },
    { content: r.height.toFixed(1),                styles: { halign: "right" as const } },
    { content: r.usedSize.toFixed(1),              styles: { halign: "right" as const, textColor: C.accent, fontStyle: "bold" as const } },
    { content: `${r.inch.toFixed(2)}"`,            styles: { halign: "right" as const } },
    { content: `₹${r.pricePerInch}`,               styles: { halign: "right" as const } },
    { content: String(r.quantity),                 styles: { halign: "center" as const } },
    { content: `₹${r.total.toLocaleString("en-IN")}`, styles: { halign: "right" as const, fontStyle: "bold" as const } },
  ]);

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: y,
    margin: { left: M, right: M },
    styles: {
      fontSize: 8.5,
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
      lineColor: C.border,
      lineWidth: 0.3,
      valign: "middle",
      textColor: C.dark,
    },
    headStyles: {
      fillColor: C.dark,
      textColor: C.white,
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
    },
    alternateRowStyles: {
      fillColor: C.rowEven,
    },
    bodyStyles: {
      fillColor: C.rowOdd,
    },
    columnStyles: {
      0: { cellWidth: 38 },
      7: { textColor: C.emerald },
    },
    didParseCell: (hookData) => {
      // Last column (Total) → make it green & bold
      if (hookData.column.index === 7 && hookData.section === "body") {
        hookData.cell.styles.textColor = C.emerald;
        hookData.cell.styles.fontStyle = "bold";
      }
    },
  });

  // ── 5. Summary block ─────────────────────────────────────────────────────
  const afterTable = (doc as any).lastAutoTable.finalY as number;
  y = afterTable + 6;

  // Summary box
  const sumBoxH = 28;
  doc.setFillColor(...C.dark);
  doc.roundedRect(M, y, PW - M * 2, sumBoxH, 3, 3, "F");

  // Left stats
  const statX1 = M + 8;
  const statX2 = M + 65;

  // Total Items
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.white);
  doc.text(String(data.rows.length), statX1, y + 13);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("TOTAL LETTERS", statX1, y + 19);

  // Total Inches
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.accent);
  doc.text(`${data.totalInches}"`, statX2, y + 13);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("TOTAL INCHES", statX2, y + 19);

  // Right: Grand Total
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("GRAND TOTAL", PW - M - 8, y + 8, { align: "right" });

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.emerald);
  doc.text(
    `₹${data.grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
    PW - M - 8, y + 21, { align: "right" }
  );

  y += sumBoxH + 8;

  // ── 6. Terms & Notes ─────────────────────────────────────────────────────
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.dark);
  doc.text("Terms & Conditions", M, y);

  y += 5;
  const terms = [
    "• This quotation is valid for 7 days from the date of issue.",
    "• Prices are calculated based on the larger dimension (max of Width or Height) converted to inches.",
    `• Price per inch applied: ₹${data.globalPricePerInch}. Taxes applicable as per government norms.`,
    "• Final measurements may vary slightly based on material and installation requirements.",
    "• Advance payment of 50% required before production begins.",
  ];

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.muted);
  doc.setFontSize(7);
  terms.forEach((line) => {
    doc.text(line, M, y);
    y += 4.5;
  });

  // ── 7. Footer ─────────────────────────────────────────────────────────────
  const footY = PH - 12;

  doc.setFillColor(...C.primary);
  doc.rect(0, footY - 1, PW, 0.5, "F");

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.muted);
  doc.text(`Generated by ${company} · ${quoteDate} · Ref: ${quoteRef}`, M, footY + 4);
  doc.text("Thank you for your business!", PW - M, footY + 4, { align: "right" });

  // ── 8. Save ────────────────────────────────────────────────────────────────
  const safeName = (data.fileName ?? "quotation")
    .replace(/[^a-zA-Z0-9_.-]/g, "_")
    .replace(/_dxf$/i, "")
    .slice(0, 40);
  doc.save(`Quotation_${safeName}_${quoteRef}.pdf`);
}
