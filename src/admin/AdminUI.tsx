import type { ReactNode } from "react"
import { formatVND } from "../data/mockData"
import type { AdminPage, AdminRecord, Column } from "./adminData"

const paths: Record<string, string> = {
  dashboard: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  bookings: "M5 5h14v16H5z M8 3v4 M16 3v4 M5 10h14 M8 14h3 M8 17h7",
  licenses:
    "M3 5h18v14H3z M15 10h3 M15 14h3 M6 15c0-3 6-3 6 0 M11 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  "vehicle-types": "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z",
  vehicles:
    "M3 17v-6l3-6h12l3 6v6H3z M3 11h18 M6 14h2 M16 14h2 M5 17v3 M19 17v3",
  "license-plates": "M3 6h18v12H3z M6 9h1 M17 9h1 M7 14h10",
  inspections: "M9 4H5v17h14V4h-4 M9 3h6v4H9z M8 13l3 3 5-6",
  issues: "M12 3L2 21h20L12 3z M12 9v5 M12 17v1",
  payments: "M3 5h18v14H3z M3 10h18 M6 15h4",
  promotions: "M3 3h8l10 10-8 8L3 11V3z M7 7h.01",
  reviews: "M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z",
  search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  arrow: "M5 12h14 M14 7l5 5-5 5",
  external: "M14 3h7v7 M21 3L10 14 M10 3H3v18h18v-7",
  download: "M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5",
  menu: "M3 6h18 M3 12h18 M3 18h18",
  close: "M6 6l12 12 M6 18L18 6",
  chevron: "M9 5l7 7-7 7",
  check: "M5 12l4 4L19 6",
}

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: AdminPage | keyof typeof paths
  className?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] ?? paths.dashboard} />
    </svg>
  )
}

export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[#d6dae8] bg-white px-3.5 py-2.5 text-xs font-semibold text-navy transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
export const primaryClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-40"
export const inputClass =
  "w-full rounded-lg border border-[#d6dae8] bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"

export function Badge({ status }: { status: string }) {
  const tone = [
    "Active",
    "Available",
    "Approved",
    "Paid",
    "Published",
    "Passed",
    "Registered",
    "Resolved",
  ].includes(status)
    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
    : ["Rejected", "Failed", "Cancelled", "High"].includes(status)
      ? "bg-red-50 text-red-700 border-red-200/80"
      : [
            "Pending",
            "Pending payment",
            "Maintenance",
            "Renewal due",
            "Open",
            "Medium",
          ].includes(status)
        ? "bg-amber-50 text-amber-800 border-amber-200/80"
        : ["Confirmed", "Rented", "Scheduled", "In progress"].includes(status)
          ? "bg-blue-50 text-blue-700 border-blue-200/80"
          : "bg-surface text-[#6b7694] border-[#d6dae8]"
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export function formatDate(value: string | number) {
  const date = new Date(String(value))
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
}

export function Cell({ row, column }: {
  row: AdminRecord
  column: Column
}) {
  const value = row[column.key]
  if (column.format === "money")
    return (
      <span className="whitespace-nowrap font-medium">
        {formatVND(Number(value))}
      </span>
    )
  if (column.format === "date")
    return (
      <span className="whitespace-nowrap text-[#6b7694]">
        {formatDate(value)}
      </span>
    )
  if (column.format === "rating")
    return (
      <span className="whitespace-nowrap font-medium">
        <span className="text-amber" aria-hidden="true">
          ★
        </span>{" "}
        {value} / 5
      </span>
    )
  if (column.format === "mono")
    return (
      <span className="whitespace-nowrap font-mono-data text-xs">{value}</span>
    )
  if (column.key === "priority") return <Badge status={String(value)} />
  if (column.key === "customer")
    return (
      <span className="flex items-center gap-2.5 whitespace-nowrap">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[10px] font-semibold text-[#6b7694]"
          aria-hidden="true"
        >
          {String(value)
            .split(" ")
            .slice(-2)
            .map((name) => name[0])
            .join("")}
        </span>
        <span className="font-medium">{value}</span>
      </span>
    )
  return (
    <span
      className={
        column.key === "comment"
          ? "block max-w-64 truncate text-[#6b7694]"
          : "whitespace-nowrap"
      }
      title={String(value)}
    >
      {value}
    </span>
  )
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl border border-[#d6dae8] bg-white ${className}`}
    >
      {children}
    </section>
  )
}

export function RecordTable({
  rows,
  columns,
  onView,
  label,
}: {
  rows: AdminRecord[]
  columns: Column[]
  onView: (row: AdminRecord) => void
  label: string
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{label}</caption>
        <thead className="border-y border-[#d6dae8]/70 bg-surface/70 text-[10px] uppercase tracking-wider text-[#6b7694]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="whitespace-nowrap px-5 py-3.5 font-semibold"
              >
                {column.label}
              </th>
            ))}
            <th scope="col" className="px-5 py-3.5 font-semibold">
              Status
            </th>
            <th scope="col" className="px-5 py-3.5">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#d6dae8]/60">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-surface/60">
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-4">
                  <Cell row={row} column={column} />
                </td>
              ))}
              <td className="px-5 py-4">
                <Badge status={row.status} />
              </td>
              <td className="px-5 py-4">
                <button
                  className="rounded-md p-2 text-[#6b7694] hover:bg-surface-2 hover:text-navy"
                  aria-label={`View ${row.id}`}
                  onClick={() => onView(row)}
                >
                  <Icon name="chevron" className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function downloadCsv(rows: AdminRecord[], filename: string) {
  if (!rows.length) return
  const keys = [...new Set(rows.flatMap((row) => Object.keys(row)))]
  const escape = (value: string | number | undefined) => {
    let text = String(value ?? "")
    if (/^[=+@\-\t\r]/.test(text)) text = `'${text}`
    return `"${text.replace(/"/g, '""')}"`
  }
  const csv = [
    keys.map(escape).join(","),
    ...rows.map((row) => keys.map((key) => escape(row[key])).join(",")),
  ].join("\r\n")
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }),
  )
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
