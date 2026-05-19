"use client";

import * as React from "react";
import { useState, useCallback, useRef } from "react";
import {
  Upload, RotateCcw, Save, IndianRupee, Ruler,
  Settings2, FileText, AlertTriangle, Info,
  ChevronDown, ChevronUp, Pencil, Check, X, Eye, Maximize2, Trash2,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";
import { generateQuotationPdf } from "@/lib/dxf-quotation-pdf";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface BackendObject {
  id: number;
  object: string;
  entityType: string;
  layer: string;
  width: number;
  height: number;
  calculatedSize: number;
  quantity: number;
  isText: boolean;
  svgPath?: string;
  boundingBox: { minX: number; minY: number; maxX: number; maxY: number };
}
interface DxfApiResult {
  sessionId: string;
  fileName: string;
  unit: string;
  totalDesignWidth: number;
  totalDesignHeight: number;
  totalArea: number;
  totalObjects: number;
  totalLetters: number;
  detectedLayers: string[];
  warnings: string[];
  objects: BackendObject[];
}

// Our pricing row — what we display/edit
interface PricingRow {
  id: number;
  label: string;       // letter / shape name
  layer: string;
  width: number;       // mm — editable
  height: number;      // mm — editable
  usedSize: number;    // max(w,h) — auto
  inch: number;        // usedSize / 25.4 — auto
  pricePerInch: number; // editable per-row
  price: number;       // inch × pricePerInch — auto
  quantity: number;    // editable
  total: number;       // price × quantity — auto
  svgPath?: string;
  boundingBox: { minX: number; minY: number; maxX: number; maxY: number };
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api/v1";
const MM_PER_INCH = 25.4;

// ─── Pricing Math ─────────────────────────────────────────────────────────────
function calcRow(r: PricingRow): PricingRow {
  const usedSize = Math.max(r.width, r.height);
  const inch = parseFloat((usedSize / MM_PER_INCH).toFixed(2));
  const price = parseFloat((inch * r.pricePerInch).toFixed(2));
  const total = parseFloat((price * r.quantity).toFixed(2));
  return { ...r, usedSize, inch, price, total };
}

function buildRows(objects: BackendObject[], globalPricePerInch: number): PricingRow[] {
  return objects.map((o) =>
    calcRow({
      id: o.id,
      label: o.object,
      layer: o.layer,
      width: o.width,
      height: o.height,
      usedSize: o.calculatedSize,
      inch: 0,
      pricePerInch: globalPricePerInch,
      price: 0,
      quantity: o.quantity,
      total: 0,
      svgPath: o.svgPath,
      boundingBox: o.boundingBox,
    })
  );
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ onUpload, loading }: { onUpload: (f: File) => void; loading: boolean }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handle = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".dxf")) {
      toast.error("Only .dxf files are accepted");
      return;
    }
    onUpload(file);
  };

  return (
    <div
      onClick={() => !loading && ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handle(f); }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer select-none transition-all duration-300 px-8 py-20 group",
        drag ? "border-primary bg-primary/8 scale-[1.01]" : "border-border/60 hover:border-primary/40 hover:bg-muted/20",
        loading && "pointer-events-none opacity-70"
      )}
    >
      <input ref={ref} type="file" accept=".dxf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }} />

      <div className={cn("mb-5 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200",
        drag ? "bg-primary/15 scale-110" : "bg-muted/60 group-hover:bg-primary/10"
      )}>
        {loading
          ? <RotateCcw className="h-7 w-7 animate-spin text-primary" />
          : <Upload className={cn("h-7 w-7 transition-colors", drag ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
        }
      </div>

      <p className="text-lg font-bold mb-1">
        {loading ? "Parsing DXF file…" : drag ? "Release to upload" : "Drop your DXF file here"}
      </p>
      <p className="text-sm text-muted-foreground mb-5">
        {loading ? "Extracting letters, sizes and layers…" : "CorelDRAW exported .dxf files supported"}
      </p>
      {!loading && (
        <Button variant="outline" size="sm" className="gap-2 rounded-xl hover:bg-primary/10 hover:border-primary/40">
          <FileText className="h-4 w-4" /> Browse File
        </Button>
      )}
    </div>
  );
}

// ─── Inline Editable Cell ─────────────────────────────────────────────────────
interface EditCellProps {
  value: number;
  onSave: (v: number) => void;
  prefix?: string;
  suffix?: string;
  align?: "left" | "right";
  min?: number;
}
function EditCell({ value, onSave, prefix = "", suffix = "", align = "right", min = 0 }: EditCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const commit = () => {
    const parsed = parseFloat(draft);
    if (!isNaN(parsed) && parsed >= min) onSave(parsed);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          autoFocus
          type="number"
          min={min}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
          className="h-7 w-20 text-xs px-2 rounded-lg"
        />
        <button onClick={commit} className="text-primary"><Check className="h-3.5 w-3.5" /></button>
        <button onClick={() => setEditing(false)} className="text-muted-foreground"><X className="h-3.5 w-3.5" /></button>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setDraft(String(value)); setEditing(true); }}
      className={cn("group flex items-center gap-1 text-sm rounded px-1 -mx-1 hover:bg-muted/60 transition-colors",
        align === "right" ? "justify-end" : "justify-start"
      )}
    >
      <span className="font-semibold">{prefix}{value}{suffix}</span>
      <Pencil className="h-2.5 w-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function DxfPricingPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiResult, setApiResult] = useState<DxfApiResult | null>(null);
  const [rows, setRows] = useState<PricingRow[]>([]);
  const [globalPricePerInch, setGlobalPricePerInch] = useState(150);
  const [globalDraftPPi, setGlobalDraftPPi] = useState("150");
  const [showWarnings, setShowWarnings] = useState(false);

  // Hover states to link visual elements with list items
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // ── Upload & Parse ──────────────────────────────────────────────────────────
  const handleUpload = useCallback(async (file: File) => {
    setLoading(true);
    setApiResult(null);
    setRows([]);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/dxf/parse`, { method: "POST", body: form });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      const data: DxfApiResult = json.data;
      setApiResult(data);
      setRows(buildRows(data.objects, globalPricePerInch));
      toast.success(`Detected ${data.totalObjects} letters/objects from "${file.name}"`);
    } catch (e: any) {
      toast.error("Parse failed", { description: e.message });
    } finally {
      setLoading(false);
    }
  }, [globalPricePerInch]);

  // ── Apply Global Price Per Inch ────────────────────────────────────────────
  const applyGlobalPpi = () => {
    const val = parseFloat(globalDraftPPi);
    if (isNaN(val) || val <= 0) { toast.error("Enter a valid price per inch"); return; }
    setGlobalPricePerInch(val);
    setRows((prev) => prev.map((r) => calcRow({ ...r, pricePerInch: val })));
    toast.success(`Price per inch updated to ₹${val} for all rows`);
  };

  // ── Row Update helpers ─────────────────────────────────────────────────────
  const updateRow = (id: number, patch: Partial<PricingRow>) =>
    setRows((prev) => prev.map((r) => r.id === id ? calcRow({ ...r, ...patch }) : r));

  const deleteRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Letter removed from calculation");
  };

  // ── Derived totals ─────────────────────────────────────────────────────────
  const grandTotal = rows.reduce((s, r) => s + r.total, 0);
  const totalInches = parseFloat(rows.reduce((s, r) => s + r.inch * r.quantity, 0).toFixed(2));
  const totalObjects = rows.length;

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!apiResult) return;
    setSaving(true);
    try {
      const payload = {
        sessionId: apiResult.sessionId,
        fileName: apiResult.fileName,
        unit: apiResult.unit,
        pricePerInch: globalPricePerInch,
        grandTotal,
        objects: rows.map((r) => ({
          object: r.label, layer: r.layer,
          width: r.width, height: r.height,
          usedSize: r.usedSize, inch: r.inch,
          pricePerInch: r.pricePerInch, price: r.price,
          quantity: r.quantity, total: r.total,
        })),
      };
      const res = await fetch(`${API}/dxf/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success("Pricing saved successfully");
    } catch (e: any) {
      toast.error("Save failed", { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  // ── Export PDF ─────────────────────────────────────────────────────────────
  const handleExportPdf = () => {
    if (!apiResult) return;
    try {
      generateQuotationPdf({
        fileName: apiResult.fileName,
        unit: apiResult.unit,
        totalDesignWidth: apiResult.totalDesignWidth,
        totalDesignHeight: apiResult.totalDesignHeight,
        totalArea: apiResult.totalArea,
        globalPricePerInch,
        grandTotal,
        totalInches,
        rows: rows.map((r) => ({
          label: r.label,
          width: r.width,
          height: r.height,
          usedSize: r.usedSize,
          inch: r.inch,
          pricePerInch: r.pricePerInch,
          quantity: r.quantity,
          total: r.total,
        })),
      });
      toast.success("Quotation PDF generated successfully!");
    } catch (e: any) {
      toast.error("PDF generation failed", { description: e.message });
    }
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = () => { setApiResult(null); setRows([]); setHoveredId(null); };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full py-6 px-4">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            <IndianRupee className="h-3.5 w-3.5 text-primary" />
            DXF Pricing & Design Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Auto Letter Pricing & Verification</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a DXF file → Visualise letters on a live vector map → Auto-calculate price.
          </p>
        </div>

        {apiResult && (
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 rounded-xl h-9">
              <RotateCcw className="h-3.5 w-3.5" /> New File
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportPdf} className="gap-2 rounded-xl h-9">
              <FileDown className="h-3.5 w-3.5" /> Export PDF
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-2 rounded-xl h-9 px-5">
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving…" : "Save Pricing"}
            </Button>
          </div>
        )}
      </div>

      {/* ── Price Per Inch Settings ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
        <Settings2 className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm font-medium">Price Per Inch (₹):</span>
        <Input
          type="number"
          min={0}
          value={globalDraftPPi}
          onChange={(e) => setGlobalDraftPPi(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyGlobalPpi()}
          className="h-8 w-28 text-sm rounded-lg"
        />
        <Button size="sm" onClick={applyGlobalPpi} variant="secondary" className="h-8 rounded-lg gap-1.5 text-xs">
          <Check className="h-3.5 w-3.5" /> Apply to All
        </Button>
        <span className="text-xs text-muted-foreground ml-1">
          Formula: <code className="bg-muted px-1.5 py-0.5 rounded text-[11px]">UsedSize ÷ 25.4 × ₹{globalPricePerInch}</code>
        </span>
      </div>

      {/* ── Upload Zone ─────────────────────────────────────────────────── */}
      {!apiResult && <UploadZone onUpload={handleUpload} loading={loading} />}

      {/* ── Visual Layout ───────────────────────────────────────────────── */}
      {apiResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── Left Column: CAD Visual Blueprint Map (4 cols) ─────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-4 sticky top-6">
            <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden bg-zinc-950 dark:bg-black text-white">
              <CardHeader className="border-b border-white/10 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-violet-400" />
                    <CardTitle className="text-sm font-bold text-white">Live Design View</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-zinc-400 border-white/20">
                    {apiResult.totalDesignWidth} × {apiResult.totalDesignHeight} mm
                  </Badge>
                </div>
                <CardDescription className="text-[11px] text-zinc-400">
                  Hover over shapes to identify which row they belong to!
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 bg-zinc-950 relative flex items-center justify-center min-h-[350px]">
                {/* CAD Grid Background Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />

                {/* SVG Render Container */}
                <svg
                  viewBox={`0 0 ${apiResult.totalDesignWidth} ${apiResult.totalDesignHeight}`}
                  className="w-full h-auto max-h-[450px] relative z-10 select-none overflow-visible"
                  style={{ transform: "scale(0.95)", transformOrigin: "center" }}
                >
                  {rows.map((row) => {
                    const isHovered = hoveredId === row.id;
                    const cX = (row.boundingBox.minX + row.boundingBox.maxX) / 2;
                    const cY = (row.boundingBox.minY + row.boundingBox.maxY) / 2;
                    
                    return (
                      <g
                        key={row.id}
                        onMouseEnter={() => setHoveredId(row.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className="cursor-pointer transition-all duration-200"
                      >
                        {/* Glowing Hover Bbox Outline */}
                        {isHovered && (
                          <rect
                            x={row.boundingBox.minX - 1}
                            y={row.boundingBox.minY - 1}
                            width={row.width + 2}
                            height={row.height + 2}
                            fill="rgba(139, 92, 246, 0.05)"
                            stroke="rgba(139, 92, 246, 0.4)"
                            strokeWidth={1}
                            strokeDasharray="2 2"
                            rx={2}
                          />
                        )}

                        {/* Clustered Geometry Path */}
                        {row.svgPath && (
                          <path
                            d={row.svgPath}
                            fill="none"
                            stroke={isHovered ? "#10b981" : "#8b5cf6"}
                            strokeWidth={isHovered ? 2.5 : 1.2}
                            className="transition-all duration-150"
                            style={{
                              filter: isHovered ? "drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))" : "none"
                            }}
                          />
                        )}

                        {/* Centered Indicator Badge */}
                        <g transform={`translate(${cX}, ${cY})`}>
                          <circle
                            r={isHovered ? 6 : 4}
                            fill={isHovered ? "#10b981" : "#18181b"}
                            stroke={isHovered ? "#ffffff" : "#a78bfa"}
                            strokeWidth={1}
                            className="transition-all"
                          />
                          {isHovered && (
                            <text
                              y={-10}
                              textAnchor="middle"
                              className="text-[10px] font-extrabold fill-white select-none transition-all drop-shadow"
                              style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 2 }}
                            >
                              {row.label}
                            </text>
                          )}
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </CardContent>
            </Card>

            {/* Dimensional Info Card */}
            <div className="rounded-xl border border-border/40 bg-card p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Design Size:</span>
                <span className="font-semibold text-foreground">
                  {apiResult.totalDesignWidth} × {apiResult.totalDesignHeight} mm
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Print Area:</span>
                <span className="font-semibold text-foreground">
                  {(apiResult.totalArea * 1e6).toLocaleString()} mm² ({(apiResult.totalArea).toFixed(4)} m²)
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-border/40 pt-2 font-medium">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-emerald-500 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Visual paths linked
                </span>
              </div>
            </div>
          </div>

          {/* ── Right Column: Pricing Table & Details (7 cols) ────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Warnings Alert */}
            {apiResult.warnings.length > 0 && (
              <>
                <button
                  onClick={() => setShowWarnings((v) => !v)}
                  className="flex items-center gap-2 text-xs font-medium text-amber-600 rounded-xl border border-amber-300/40 bg-amber-50/50 dark:bg-amber-900/10 px-4 py-2.5 hover:bg-amber-50 transition-colors w-full text-left"
                >
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  {apiResult.warnings.length} parser warning(s)
                  {showWarnings ? <ChevronUp className="h-3.5 w-3.5 ml-auto" /> : <ChevronDown className="h-3.5 w-3.5 ml-auto" />}
                </button>
                {showWarnings && (
                  <ul className="rounded-xl border border-amber-200/40 bg-amber-50/30 dark:bg-amber-900/5 px-4 py-3 space-y-1">
                    {apiResult.warnings.map((w, i) => (
                      <li key={i} className="text-xs text-amber-700 dark:text-amber-400 flex gap-2">
                        <Info className="h-3 w-3 mt-0.5 shrink-0" />{w}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {/* Table */}
            <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Pricing Breakdown</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Click any cell to edit. Width/Height/PricePerInch changes auto-recalculate prices.
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-xs gap-1">
                    <Ruler className="h-3 w-3" />{totalObjects} visible letters
                  </Badge>
                </div>
              </CardHeader>

              {/* Table Header */}
              <div className="grid grid-cols-[1.6fr_1fr_1fr_1.1fr_0.8fr_1fr_0.7fr_1.1fr_0.5fr] gap-2 px-4 py-2.5 bg-muted/40 border-b border-border/30 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                <span>Letter / Name</span>
                <span className="text-right">Width (mm)</span>
                <span className="text-right">Height (mm)</span>
                <span className="text-right">Used Size</span>
                <span className="text-right">Inch</span>
                <span className="text-right">₹/inch</span>
                <span className="text-right">Qty</span>
                <span className="text-right font-bold">Total</span>
                <span className="text-center">Action</span>
              </div>

              {/* Rows */}
              <CardContent className="p-0 max-h-[50vh] overflow-y-auto">
                {rows.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-12">No objects extracted</p>
                ) : (
                  rows.map((row, i) => {
                    const isHovered = hoveredId === row.id;
                    
                    return (
                      <div
                        key={row.id}
                        onMouseEnter={() => setHoveredId(row.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={cn(
                          "grid grid-cols-[1.6fr_1fr_1fr_1.1fr_0.8fr_1fr_0.7fr_1.1fr_0.5fr] gap-2 items-center px-4 py-2.5 border-b border-border/20 transition-all",
                          isHovered ? "bg-primary/5 shadow-inner scale-[0.99] border-l-4 border-l-primary" : i % 2 === 0 ? "bg-background" : "bg-muted/5"
                        )}
                      >
                        {/* Label */}
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold transition-colors",
                            isHovered ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                          )}>
                            {row.id}
                          </span>
                          <span className="text-sm font-bold truncate">{row.label}</span>
                          <span className="text-[10px] text-muted-foreground truncate hidden xl:block">
                            ({row.layer})
                          </span>
                        </div>

                        {/* Width */}
                        <div className="flex justify-end">
                          <EditCell value={row.width} onSave={(v) => updateRow(row.id, { width: v })} suffix=" mm" />
                        </div>

                        {/* Height */}
                        <div className="flex justify-end">
                          <EditCell value={row.height} onSave={(v) => updateRow(row.id, { height: v })} suffix=" mm" />
                        </div>

                        {/* Used Size (max) */}
                        <div className="text-right">
                          <span className={cn("text-xs font-bold",
                            row.width >= row.height ? "text-violet-600" : "text-emerald-600"
                          )}>
                            {row.usedSize} mm
                          </span>
                        </div>

                        {/* Inch */}
                        <div className="text-right text-xs text-muted-foreground font-semibold">
                          {row.inch}"
                        </div>

                        {/* Price per inch */}
                        <div className="flex justify-end">
                          <EditCell value={row.pricePerInch} onSave={(v) => updateRow(row.id, { pricePerInch: v })} prefix="₹" min={0} />
                        </div>

                        {/* Qty */}
                        <div className="flex justify-end">
                          <EditCell value={row.quantity} onSave={(v) => updateRow(row.id, { quantity: Math.max(1, Math.round(v)) })} min={1} />
                        </div>

                        {/* Total */}
                        <div className="text-right">
                          <span className="text-sm font-bold text-foreground">₹{row.total.toLocaleString()}</span>
                        </div>

                        {/* Action - Delete Button */}
                        <div className="flex justify-center">
                          <button
                            onClick={() => deleteRow(row.id)}
                            className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete this item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>

              {/* ── Grand Total Footer ───────────────────────────────────── */}
              <div className="border-t border-border/50 bg-muted/20 px-4 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>{totalObjects} letters detected</span>
                  <span>₹{globalPricePerInch}/inch</span>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                  {/* Total Inches */}
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Total Inches</span>
                    <span className="text-xl font-extrabold text-violet-500 tracking-tight">{totalInches}"</span>
                  </div>

                  <div className="w-px h-8 bg-border/60" />

                  {/* Grand Total */}
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Grand Total</span>
                    <span className="text-2xl font-extrabold text-primary tracking-tight">
                      ₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Per-Letter Unit Price Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {rows.map((r) => (
                <div
                  key={r.id}
                  onMouseEnter={() => setHoveredId(r.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    "flex flex-col rounded-xl border p-3 gap-0.5 transition-all cursor-pointer",
                    hoveredId === r.id ? "border-primary bg-primary/5 scale-105 shadow-sm" : "border-border/40 bg-card hover:bg-muted/30"
                  )}
                >
                  <span className="text-base font-extrabold text-primary truncate">{r.label}</span>
                  <span className="text-[10px] text-muted-foreground">{r.usedSize} mm → {r.inch}"</span>
                  <span className="text-sm font-bold text-foreground">₹{r.price}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pb-6">
              <Button variant="outline" onClick={handleReset} className="gap-2 rounded-xl">
                <RotateCcw className="h-4 w-4" /> New File
              </Button>
              <Button variant="secondary" onClick={handleExportPdf} className="gap-2 rounded-xl">
                <FileDown className="h-4 w-4" /> Export PDF Proposal
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2 rounded-xl px-6">
                <Save className="h-4 w-4" />
                {saving ? "Saving…" : "Save Pricing"}
              </Button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
