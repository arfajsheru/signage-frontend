"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ── Types ─────────────────────────────────────────────────────────────────────

export type SortDirection = "asc" | "desc" | null

export interface ColumnDef<T> {
  key: string
  header: string
  accessorFn?: (row: T) => React.ReactNode
  sortable?: boolean
  className?: string
  headerClassName?: string
}

export interface DataTablePagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  pagination?: DataTablePagination
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
  onSort?: (key: string, direction: SortDirection) => void
  sortKey?: string
  sortDirection?: SortDirection
  isLoading?: boolean
  emptyMessage?: string
  emptyDescription?: string
  className?: string
  rowKey: (row: T) => string | number
  renderActions?: (row: T) => React.ReactNode
}

// ── Skeleton Row ──────────────────────────────────────────────────────────────

function SkeletonRow({ columns }: { columns: number }) {
  return (
    <tr className="border-b border-border/40">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 rounded-md bg-muted animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  )
}

// ── Sort Icon ─────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === "asc") return <ChevronUp className="h-3.5 w-3.5 text-primary" />
  if (direction === "desc") return <ChevronDown className="h-3.5 w-3.5 text-primary" />
  return <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ message, description }: { message: string; description?: string }) {
  return (
    <tr>
      <td colSpan={999}>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="relative mb-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg className="h-8 w-8 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary/20 animate-ping" />
          </div>
          <p className="text-sm font-semibold text-foreground">{message}</p>
          {description && <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>}
        </div>
      </td>
    </tr>
  )
}

// ── Main DataTable ────────────────────────────────────────────────────────────

export function DataTable<T>({
  data,
  columns,
  pagination,
  onPageChange,
  onLimitChange,
  onSort,
  sortKey,
  sortDirection,
  isLoading = false,
  emptyMessage = "No records found",
  emptyDescription,
  className,
  rowKey,
  renderActions,
}: DataTableProps<T>) {
  const allColumns = renderActions
    ? [...columns, { key: "__actions__", header: "Actions", className: "text-right" } as ColumnDef<T>]
    : columns

  const handleSort = (col: ColumnDef<T>) => {
    if (!col.sortable || !onSort) return
    let next: SortDirection = "asc"
    if (sortKey === col.key) {
      next = sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc"
    }
    onSort(col.key, next)
  }

  const showData = !isLoading && data.length > 0
  const showEmpty = !isLoading && data.length === 0

  return (
    <div className={cn("flex flex-col gap-0 rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm", className)}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              {allColumns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none whitespace-nowrap",
                    col.sortable && "cursor-pointer group",
                    col.headerClassName,
                    col.key === "__actions__" && "text-right"
                  )}
                  onClick={() => handleSort(col)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && <SortIcon direction={sortKey === col.key ? sortDirection ?? null : null} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} columns={allColumns.length} />
              ))}
            {showEmpty && <EmptyState message={emptyMessage} description={emptyDescription} />}
            {showData &&
              data.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="group transition-colors hover:bg-muted/30"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3.5 align-middle text-sm text-foreground whitespace-nowrap",
                        col.className
                      )}
                    >
                      {col.accessorFn
                        ? col.accessorFn(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {renderActions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between gap-4 border-t border-border/60 bg-muted/20 px-4 py-3">
          {/* Left: rows per page + info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Rows per page</span>
              <Select
                value={String(pagination.limit)}
                onValueChange={(v) => onLimitChange?.(Number(v))}
              >
                <SelectTrigger className="h-7 w-[66px] text-xs border-border/60 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((n) => (
                    <SelectItem key={n} value={String(n)} className="text-xs">
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {pagination.total === 0 ? "0 records" : (
                <>
                  {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  <span className="font-semibold text-foreground">{pagination.total}</span> records
                </>
              )}
            </span>
          </div>

          {/* Right: page navigation */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">
              Page <span className="font-semibold text-foreground">{pagination.page}</span> / {pagination.totalPages}
            </span>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={pagination.page <= 1}
                onClick={() => onPageChange?.(1)}
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={pagination.page <= 1}
                onClick={() => onPageChange?.(pagination.page - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange?.(pagination.page + 1)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange?.(pagination.totalPages)}
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
