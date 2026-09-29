import { useState } from "react"
import { formatVND } from "../data/mockData"
import {
  adminHref,
  sections,
  type AdminData,
  type AdminRecord,
  type Section,
} from "./adminData"
import { Card, Icon, RecordTable } from "./AdminUI"

export default function AdminDashboard({
  data,
  onView,
}: {
  data: AdminData
  onView: (section: Section, record: AdminRecord) => void
}) {
  const [days, setDays] = useState(7)
  const paid = data.payments.filter((record) => record.status === "Paid")
  const revenue = paid.reduce((sum, record) => sum + Number(record.amount), 0)
  const available = data.vehicles.filter(
    (record) => record.status === "Available",
  ).length
  const pending = data.licenses.filter(
    (record) => record.status === "Pending",
  ).length
  const openIssues = data.issues.filter(
    (record) => record.status !== "Resolved",
  ).length
  const average = data.reviews.length
    ? data.reviews.reduce((sum, record) => sum + Number(record.rating), 0) /
      data.reviews.length
    : 0
  const chart = Array.from({ length: days }, (_, index) => {
    const day = 30 - days + index
    const date = `2026-09-${String(day).padStart(2, "0")}`
    return {
      day,
      amount: paid
        .filter((payment) => payment.date === date)
        .reduce((sum, payment) => sum + Number(payment.amount), 0),
    }
  })
  const max = Math.max(1, ...chart.map((item) => item.amount))
  const chartTotal = chart.reduce((sum, item) => sum + item.amount, 0)
  const metrics = [
    {
      label: "Rental revenue",
      value: formatVND(revenue),
      note: `${paid.length} successful payments`,
      icon: "payments" as const,
      href: "payments" as const,
    },
    {
      label: "Total bookings",
      value: data.bookings.length,
      note: `${data.bookings.filter((record) => record.status === "Active").length} rentals currently active`,
      icon: "bookings" as const,
      href: "bookings" as const,
    },
    {
      label: "Available vehicles",
      value: `${available} / ${data.vehicles.length}`,
      note: "Ready for the next journey",
      icon: "vehicles" as const,
      href: "vehicles" as const,
    },
    {
      label: "Pending verifications",
      value: pending,
      note: pending ? "Driver licenses awaiting review" : "All caught up",
      icon: "licenses" as const,
      href: "licenses" as const,
    },
  ]
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <a
            key={metric.label}
            href={adminHref(metric.href)}
            className="group rounded-2xl border border-[#d6dae8] bg-white p-5 transition-all hover:border-amber/60 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#6b7694]">
                {metric.label}
              </p>
              <span
                className={`rounded-lg p-2 ${
                  metric.href === "licenses"
                    ? "bg-amber/10 text-amber-dark"
                    : "bg-surface text-navy"
                }`}
              >
                <Icon name={metric.icon} className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight">
              {metric.value}
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-[#6b7694]">
              <span>{metric.note}</span>
              <Icon
                name="arrow"
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
              />
            </div>
          </a>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Revenue overview</h2>
              <p className="mt-1 text-xs text-[#6b7694]">
                Successful rental payments · VND
              </p>
            </div>
            <label>
              <span className="sr-only">Revenue period</span>
              <select
                className="rounded-lg border border-[#d6dae8] bg-white px-3 py-2 text-xs"
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
              </select>
            </label>
          </div>
          <p className="mt-5 text-2xl font-semibold">
            {formatVND(chartTotal)}
            <span className="ml-2 text-xs font-normal text-[#6b7694]">
              in this period
            </span>
          </p>
          <div
            className="mt-6 flex gap-3"
            role="img"
            aria-label={`Revenue from September ${30 - days} to 29, 2026: ${chart.map((item) => `September ${item.day}: ${formatVND(item.amount)}`).join("; ")}`}
          >
            <div
              aria-hidden="true"
              className="flex h-40 shrink-0 flex-col justify-between text-[10px] text-[#6b7694]"
            >
              <span>{(max / 1000000).toFixed(1)}m</span>
              <span>{(max / 2000000).toFixed(1)}m</span>
              <span>0</span>
            </div>
            <div
              className="relative flex flex-1 items-end justify-between gap-2 border-b border-[#d6dae8] pb-0"
              aria-hidden="true"
            >
              <div className="pointer-events-none absolute inset-0 mb-7 flex h-40 flex-col justify-between">
                <div className="border-t border-dashed border-[#d6dae8]/70" />
                <div className="border-t border-dashed border-[#d6dae8]/70" />
                <div />
              </div>
              {chart.map((item) => (
                <div
                  key={item.day}
                  className="relative min-w-0 flex-1 text-center"
                  title={`Sep ${item.day}: ${formatVND(item.amount)}`}
                >
                  <div className="flex h-40 items-end justify-center">
                    <div
                      className={`w-full max-w-10 rounded-t-md ${
                        item.day === 29 ? "bg-amber" : "bg-navy/85"
                      } transition-all`}
                      style={{
                        height: `${
                          item.amount
                            ? Math.max(3, (item.amount / max) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <p className="pt-3 pb-2 text-[9px] text-[#6b7694]">
                    {item.day}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] text-[#6b7694]">
            <span>September 2026</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-navy" />
              Rental revenue
            </span>
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Fleet availability</h2>
            <a
              href={adminHref("vehicles")}
              className="text-xs font-medium text-[#6b7694] hover:text-amber-dark"
            >
              View fleet →
            </a>
          </div>
          <div className="my-6 flex items-center gap-6">
            <div
              className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
              role="img"
              aria-label={`${available} of ${data.vehicles.length} vehicles available`}
              style={{
                background: `conic-gradient(#0d1b3e 0 ${(available / Math.max(data.vehicles.length, 1)) * 100}%, #e8920a ${(available / Math.max(data.vehicles.length, 1)) * 100}% ${((available + data.vehicles.filter((record) => record.status === "Rented").length) / Math.max(data.vehicles.length, 1)) * 100}%, #d6dae8 0)`,
              }}
            >
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-2xl font-semibold">
                  {data.vehicles.length}
                </span>
                <span className="text-[10px] text-[#6b7694]">
                  Total vehicles
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {["Available", "Rented", "Maintenance"].map((status, i) => (
                <div
                  key={status}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <span className="flex items-center gap-2 text-[#6b7694]">
                    <span
                      className={`h-2 w-2 rounded-full ${["bg-navy", "bg-amber", "bg-[#d6dae8]"][i]}`}
                    />
                    {status}
                  </span>
                  <span className="font-semibold">
                    {
                      data.vehicles.filter((record) => record.status === status)
                        .length
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
            <div>
              <p className="text-xs font-medium">Customer satisfaction</p>
              <p className="mt-1 text-[11px] text-[#6b7694]">
                Across {data.reviews.length} sample reviews
              </p>
            </div>
            <span className="font-semibold">
              <span className="text-amber">★</span> {average.toFixed(1)}
              <span className="text-xs font-normal text-[#6b7694]"> / 5</span>
            </span>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <Card className="min-w-0 overflow-hidden">
          <div className="flex items-center justify-between p-5">
            <div>
              <h2 className="text-sm font-semibold">Recent bookings</h2>
              <p className="mt-1 text-xs text-[#6b7694]">
                The latest journeys on your calendar
              </p>
            </div>
            <a
              className="whitespace-nowrap text-xs font-semibold text-amber-dark hover:underline"
              href={adminHref("bookings")}
            >
              View all →
            </a>
          </div>
          <RecordTable
            rows={[...data.bookings]
              .sort((a, b) => String(b.start).localeCompare(String(a.start)))
              .slice(0, 5)}
            columns={sections.bookings.columns.filter((column) =>
              ["customer", "vehicle", "amount"].includes(column.key),
            )}
            onView={(record) => onView("bookings", record)}
            label="Recent bookings"
          />
        </Card>
        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber" />
              <h2 className="text-sm font-semibold">Needs your attention</h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  section: "licenses" as const,
                  title: "License verifications",
                  count: pending,
                  detail: "Help drivers get ready to go",
                },
                {
                  section: "issues" as const,
                  title: "Unresolved issues",
                  count: openIssues,
                  detail: "Keep every rental running smoothly",
                },
                {
                  section: "inspections" as const,
                  title: "Scheduled inspections",
                  count: data.inspections.filter(
                    (record) => record.status === "Scheduled",
                  ).length,
                  detail: "Keep your fleet road-ready",
                },
              ].map((item) => (
                <a
                  key={item.section}
                  href={adminHref(item.section)}
                  className="flex items-center gap-3 rounded-xl border border-[#d6dae8]/70 p-3 transition-colors hover:border-amber/50 hover:bg-amber/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber-dark">
                    <Icon name={item.section} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">{item.title}</p>
                    <p className="mt-1 text-[10px] text-[#6b7694]">
                      {item.detail}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{item.count}</span>
                </a>
              ))}
            </div>
          </Card>
          <div className="rounded-2xl bg-navy p-5 text-white">
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-amber-light">
              DriveNow · Ho Chi Minh City
            </p>
            <h2 className="mt-2 font-display text-2xl">
              Good journeys start here.
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Your fleet, your customers, and the details that keep everything
              moving.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
