import { useEffect, useRef, useState } from "react"
import { sections, type AdminRecord, type Section } from "./adminData"
import {
  Badge,
  Card,
  Cell,
  Icon,
  RecordTable,
  buttonClass,
  downloadCsv,
  inputClass,
  primaryClass,
} from "./AdminUI"

export function RecordDialog({
  section,
  record,
  onClose,
  onSave,
}: {
  section: Section
  record: AdminRecord
  onClose: () => void
  onSave: (record: AdminRecord) => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const config = sections[section]
  const [status, setStatus] = useState(record.status)
  const [note, setNote] = useState("")
  const [rate, setRate] = useState(String(record.rate ?? ""))
  const transitions = config.transitions[record.status] ?? []
  const editable = transitions.length > 0 || section === "vehicle-types"
  const needsReason =
    ["Rejected", "Failed", "Cancelled", "Hidden"].includes(status) &&
    status !== record.status
  const hasChanges =
    status !== record.status ||
    note.trim().length > 0 ||
    (section === "vehicle-types" && Number(rate) !== record.rate)
  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      element?.close()
      document.body.style.overflow = overflow
    }
  }, [])

  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-labelledby="record-title"
      className="m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-2xl overflow-y-auto rounded-2xl border border-[#d6dae8] bg-white p-0 text-navy shadow-2xl backdrop:bg-navy/50"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!hasChanges || (needsReason && !note.trim())) return
          onSave({
            ...record,
            status,
            ...(section === "vehicle-types" ? { rate: Number(rate) } : {}),
            ...(note.trim() ? { reviewNote: note.trim() } : {}),
          })
        }}
      >
        <div className="flex items-start justify-between border-b border-[#d6dae8] px-6 py-5">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#6b7694]">
              {config.singular} details · {record.id}
            </p>
            <h2 id="record-title" className="font-display text-3xl">
              {String(
                record.customer ??
                  record.name ??
                  record.subject ??
                  record.vehicle ??
                  record.code ??
                  record.id,
              )}
            </h2>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-surface"
            onClick={onClose}
            aria-label="Close details"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="space-y-5 p-6">
          <Badge status={record.status} />
          {section === "licenses" && (
            <div className="rounded-xl border border-amber/25 bg-amber/5 p-4">
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="font-semibold">Sample driving license</span>
                <span className="font-mono-data text-amber-dark">
                  DEMO DOCUMENT
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-[#6b7694]">
                  <Icon name="licenses" className="h-8 w-8" />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{record.customer}</p>
                  <p className="font-mono-data text-xs">{record.number}</p>
                  <p className="text-[#6b7694]">
                    Class {record.class} · Expires {record.expiry}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-[#6b7694]">
                Illustrative mock credentials. No real identity documents are
                stored in this demo.
              </p>
            </div>
          )}
          <dl className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            {Object.entries(record)
              .filter(([key]) => !["status", "id"].includes(key))
              .map(([key, value]) => {
                const column = config.columns.find((item) => item.key === key)
                const label = column?.label ?? key.replace(/([A-Z])/g, " $1")
                return (
                  <div
                    key={key}
                    className={
                      [
                        "description",
                        "notes",
                        "comment",
                        "reviewNote",
                      ].includes(key)
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
                    <dt className="mb-1 text-xs capitalize text-[#6b7694]">
                      {label}
                    </dt>
                    <dd className="break-words text-sm">
                      {column && key !== "comment" ? (
                        <Cell row={record} column={column} />
                      ) : (
                        String(value)
                      )}
                    </dd>
                  </div>
                )
              })}
          </dl>
          {editable && (
            <div className="space-y-4 border-t border-[#d6dae8] pt-5">
              {transitions.length > 0 && (
                <label className="block text-xs font-semibold">
                  Update status
                  <select
                    className={`${inputClass} mt-2`}
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option>{record.status}</option>
                    {transitions.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
              )}
              {section === "vehicle-types" && (
                <label className="block text-xs font-semibold">
                  Hourly rate (VND)
                  <input
                    className={`${inputClass} mt-2`}
                    type="number"
                    min="1000"
                    max="100000000"
                    step="1000"
                    required
                    value={rate}
                    onChange={(event) => setRate(event.target.value)}
                  />
                </label>
              )}
              <label className="block text-xs font-semibold">
                {needsReason ? "Reason (required)" : "Internal note (optional)"}
                <textarea
                  className={`${inputClass} mt-2 min-h-20 resize-y font-normal`}
                  maxLength={1000}
                  required={needsReason}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Add context for your team…"
                />
              </label>
              {needsReason && note.length > 0 && !note.trim() && (
                <p className="text-xs text-red-700">
                  Enter a reason with visible text.
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[#d6dae8] bg-surface/60 px-6 py-4">
          <span className="text-xs text-[#6b7694]">
            Mock data · Changes reset on reload
          </span>
          <div className="flex gap-2">
            <button type="button" className={buttonClass} onClick={onClose}>
              Close
            </button>
            {editable && (
              <button
                type="submit"
                className={primaryClass}
                disabled={!hasChanges || (needsReason && !note.trim())}
              >
                Save changes
              </button>
            )}
          </div>
        </div>
      </form>
    </dialog>
  )
}

export default function AdminRecords({
  section,
  records,
  onView,
}: {
  section: Section
  records: AdminRecord[]
  onView: (record: AdminRecord) => void
}) {
  const config = sections[section]
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [page, setPage] = useState(1)
  const filtered = records.filter(
    (record) =>
      (status === "All" || record.status === status) &&
      Object.values(record).some((value) =>
        String(value)
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()),
      ),
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / 8))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * 8, currentPage * 8)
  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {["All", ...config.statuses.slice(0, 3)].map((value) => (
          <button
            key={value}
            onClick={() => {
              setStatus(value)
              setPage(1)
            }}
            aria-pressed={status === value}
            className={`rounded-xl border bg-white p-4 text-left transition-colors ${
              status === value
                ? "border-amber shadow-sm"
                : "border-[#d6dae8] hover:border-navy/40"
            }`}
          >
            <span className="text-xs text-[#6b7694]">
              {value === "All" ? `Total ${config.label.toLowerCase()}` : value}
            </span>
            <span className="mt-2 block text-2xl font-semibold">
              {value === "All"
                ? records.length
                : records.filter((record) => record.status === value).length}
            </span>
          </button>
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <h2 className="text-sm font-semibold">
              All {config.label.toLowerCase()}
            </h2>
            <p className="mt-1 text-xs text-[#6b7694]">
              {records.length} records in your workspace
            </p>
          </div>
          <button
            className={buttonClass}
            onClick={() => downloadCsv(filtered, `drivenow-${section}.csv`)}
            disabled={!filtered.length}
          >
            <Icon name="download" className="h-4 w-4" />
            Export CSV
          </button>
        </div>
        <div className="flex flex-col gap-3 px-5 pb-5 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search {config.label.toLowerCase()}</span>
            <span className="pointer-events-none absolute top-3 left-3 text-[#6b7694]">
              <Icon name="search" className="h-4 w-4" />
            </span>
            <input
              className={`${inputClass} pl-9`}
              placeholder={`Search ${config.label.toLowerCase()}…`}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
            />
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select
              className={`${inputClass} sm:w-44`}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
            >
              <option value="All">All statuses</option>
              {config.statuses.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
        {visible.length > 0 ? (
          <RecordTable
            rows={visible}
            columns={config.columns}
            onView={onView}
            label={config.label}
          />
        ) : (
          <div className="border-t border-[#d6dae8] px-5 py-16 text-center">
            <Icon
              name="search"
              className="mx-auto mb-3 h-8 w-8 text-[#6b7694]"
            />
            <h3 className="font-semibold">No matching records</h3>
            <p className="mt-1 text-sm text-[#6b7694]">
              Try another search or clear your filters.
            </p>
            <button
              onClick={() => {
                setQuery("")
                setStatus("All")
                setPage(1)
              }}
              className={`${buttonClass} mt-4`}
            >
              Clear filters
            </button>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d6dae8] px-5 py-4">
          <p role="status" className="text-xs text-[#6b7694]">
            Showing {filtered.length ? (currentPage - 1) * 8 + 1 : 0}–
            {Math.min(currentPage * 8, filtered.length)} of {filtered.length}{" "}
            records
          </p>
          <div className="flex items-center gap-3">
            <button
              className={buttonClass}
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className="text-xs text-[#6b7694]">
              {currentPage} / {pageCount}
            </span>
            <button
              className={buttonClass}
              disabled={currentPage === pageCount}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </>
  )
}
