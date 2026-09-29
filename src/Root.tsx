import { lazy, Suspense, useEffect, useState } from "react"
import App from "./App"
import { getAdminPage } from "./admin/adminData"

const AdminApp = lazy(() => import("./admin/AdminApp"))

/** Hash routing keeps admin links refreshable without changing customer navigation. */
export default function Root() {
  const [page, setPage] = useState(() => getAdminPage(window.location.hash))
  const [customerVisited, setCustomerVisited] = useState(page === null)
  useEffect(() => {
    const syncRoute = () => {
      const next = getAdminPage(window.location.hash)
      setPage(next)
      if (next === null) setCustomerVisited(true)
    }
    window.addEventListener("hashchange", syncRoute)
    return () => window.removeEventListener("hashchange", syncRoute)
  }, [])
  return (
    <>
      {customerVisited && (
        <div hidden={page !== null}>
          <App />
        </div>
      )}
      {page !== null && (
        <Suspense
          fallback={
            <div
              className="flex min-h-screen items-center justify-center bg-surface text-sm text-navy"
              role="status"
            >
              Loading admin workspace…
            </div>
          }
        >
          <AdminApp page={page} />
        </Suspense>
      )}
    </>
  )
}
