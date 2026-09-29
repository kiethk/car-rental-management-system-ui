import { useEffect, useRef, useState } from "react"
import AdminDashboard from "./AdminDashboard"
import AdminRecords, { RecordDialog } from "./AdminRecords"
import {
  adminHref,
  createAdminData,
  navigation,
  sections,
  snapshotDate,
  type AdminPage,
  type AdminRecord,
  type Section,
} from "./adminData"
import { Icon, formatDate } from "./AdminUI"

export default function AdminApp({ page }: { page: AdminPage }) {
  const [data, setData] = useState(createAdminData)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState<{
    section: Section
    id: string
  } | null>(null)
  const [notice, setNotice] = useState("")
  const menuDialog = useRef<HTMLDialogElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const previousPage = useRef(page)
  const title = page === "dashboard" ? "Dashboard" : sections[page].label
  const record = selected
    ? data[selected.section].find((item) => item.id === selected.id)
    : undefined

  useEffect(() => {
    setMenuOpen(false)
    setSelected(null)
    window.scrollTo(0, 0)
    if (previousPage.current !== page) heading.current?.focus()
    previousPage.current = page
  }, [page])
  useEffect(() => {
    const originalTitle = document.title
    document.title = `${title} · DriveNow Admin`
    return () => {
      document.title = originalTitle
    }
  }, [title])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(""), 5000)
    return () => window.clearTimeout(timer)
  }, [notice])
  useEffect(() => {
    if (menuOpen) menuDialog.current?.showModal()
    else menuDialog.current?.close()
    if (!menuOpen) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const desktop = window.matchMedia("(min-width: 1024px)")
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false)
    }
    desktop.addEventListener("change", closeOnDesktop)
    return () => {
      document.body.style.overflow = overflow
      desktop.removeEventListener("change", closeOnDesktop)
    }
  }, [menuOpen])

  const view = (section: Section, row: AdminRecord) =>
    setSelected({ section, id: row.id })
  const sidebar = (mobile = false) => (
    <>
      <div className="flex h-24 shrink-0 items-center gap-3 border-b border-white/10 px-6">
        <a
          href={adminHref("dashboard")}
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber text-white">
            <Icon name="vehicles" className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-wide">
              DriveNow
            </span>
            <span className="block text-[9px] font-medium uppercase tracking-[0.2em] text-amber-light">
              Admin workspace
            </span>
          </span>
        </a>
        {mobile && (
          <button
            className="ml-auto rounded p-1 text-white/70"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <Icon name="close" />
          </button>
        )}
      </div>
      <nav
        aria-label="Admin navigation"
        className="flex-1 overflow-y-auto px-3 py-5"
      >
        {navigation.map((item, index) => {
          const group = item === "dashboard" ? "" : sections[item].group
          const previous = navigation[index - 1]
          const previousGroup =
            previous && previous !== "dashboard" ? sections[previous].group : ""
          const badge =
            item === "licenses"
              ? data.licenses.filter((row) => row.status === "Pending").length
              : item === "issues"
                ? data.issues.filter((row) => row.status !== "Resolved").length
                : 0
          return (
            <div key={item}>
              {group && group !== previousGroup && (
                <p className="mt-6 mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  {group}
                </p>
              )}
              <a
                href={adminHref(item)}
                onClick={() => setMenuOpen(false)}
                aria-current={page === item ? "page" : undefined}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-medium transition-colors ${
                  page === item
                    ? "bg-amber text-white shadow-sm"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon name={item} className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1 leading-5">
                  {item === "dashboard" ? "Dashboard" : sections[item].label}
                </span>
                {badge > 0 && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] ${
                      page === item
                        ? "bg-white/20 text-white"
                        : "bg-amber/15 text-amber-light"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </a>
            </div>
          )
        })}
      </nav>
      <div className="shrink-0 border-t border-white/10 p-4">
        <a
          href="#/"
          className="flex items-center gap-3 rounded-lg px-2 py-2 text-xs text-white/65 hover:bg-white/5 hover:text-white"
        >
          <Icon name="external" className="h-4 w-4" />
          Customer website
        </a>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/20 text-[10px] font-semibold text-amber-light">
            AD
          </span>
          <div>
            <p className="text-xs font-medium">Demo administrator</p>
            <p className="mt-0.5 text-[10px] text-white/40">
              Local mock workspace
            </p>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="admin-workspace min-h-screen bg-surface text-navy">
      <a
        href="#admin-content"
        onClick={(event) => {
          event.preventDefault()
          heading.current?.focus()
        }}
        className="fixed top-3 left-3 z-50 -translate-y-24 rounded-lg bg-white p-3 text-sm focus:translate-y-0"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-navy text-white lg:flex">
        {sidebar()}
      </aside>
      <dialog
        ref={menuDialog}
        onCancel={() => setMenuOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setMenuOpen(false)
        }}
        aria-label="Admin menu"
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[90vw] border-0 bg-navy p-0 text-white backdrop:bg-navy/50"
      >
        <div className="flex h-full flex-col">{sidebar(true)}</div>
      </dialog>
      <div className="lg:pl-64">
        <header className="flex h-20 items-center justify-between gap-3 border-b border-[#d6dae8] bg-white px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              className="rounded-lg border border-[#d6dae8] p-2 lg:hidden"
            >
              <Icon name="menu" />
            </button>
            <div className="flex min-w-0 items-center gap-2 text-xs">
              <span className="hidden text-[#6b7694] sm:inline">Workspace</span>
              <span className="hidden text-[#b0b8d0] sm:inline">/</span>
              <span className="truncate font-medium">{title}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-full border border-amber/25 bg-amber/5 px-2.5 py-1 text-[10px] font-medium text-amber-dark">
              Demo mode
            </span>
            <span className="hidden h-6 w-px bg-[#d6dae8] sm:block" />
            <span className="hidden text-xs text-[#6b7694] sm:block">
              Ho Chi Minh City
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-[10px] font-semibold text-white">
              AD
            </span>
          </div>
        </header>
        <main id="admin-content" className="mx-auto max-w-[1600px] p-5 sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-dark">
                {page === "dashboard"
                  ? "Your business at a glance"
                  : sections[page].group}
              </p>
              <h1
                ref={heading}
                tabIndex={-1}
                className="font-display text-4xl leading-tight outline-none sm:text-[42px]"
              >
                {page === "dashboard" ? "Welcome back, Admin" : title}
              </h1>
              <p className="mt-2 text-sm text-[#6b7694]">
                {page === "dashboard"
                  ? "Here’s what’s happening at DriveNow today."
                  : sections[page].description}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[#d6dae8] bg-white px-3.5 py-2.5 text-xs text-[#6b7694]">
              <Icon name="bookings" className="h-4 w-4" />
              {formatDate(snapshotDate)}
              <span className="border-l border-[#d6dae8] pl-2 text-[10px]">
                Sample snapshot
              </span>
            </div>
          </div>
          {page === "dashboard" ? (
            <AdminDashboard data={data} onView={view} />
          ) : (
            <AdminRecords
              key={page}
              section={page}
              records={data[page]}
              onView={(row) => view(page, row)}
            />
          )}
          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-[#d6dae8] pt-5 text-[10px] text-[#6b7694]">
            <span>DriveNow Administration</span>
            <span>
              Mock data only · Changes reset on reload · Customer bookings are
              separate
            </span>
          </footer>
        </main>
      </div>
      {selected && record && (
        <RecordDialog
          key={`${selected.section}-${record.id}`}
          section={selected.section}
          record={record}
          onClose={() => setSelected(null)}
          onSave={(updated) => {
            const section = selected.section
            setData((current) => ({
              ...current,
              [section]: current[section].map((item) =>
                item.id === updated.id ? updated : item,
              ),
            }))
            setNotice(`${sections[section].singular} ${updated.id} updated.`)
            setSelected(null)
          }}
        />
      )}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed right-5 bottom-5 z-50"
      >
        {notice && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-4 text-sm shadow-lg">
            <span className="rounded-full bg-emerald-50 p-1 text-emerald-700">
              <Icon name="check" className="h-4 w-4" />
            </span>
            {notice}
          </div>
        )}
      </div>
    </div>
  )
}
