import { Navigate, createBrowserRouter } from "react-router-dom"

import { AppLayout } from "@/app/layout/AppLayout"
import { ApiDocumentationPage } from "@/features/api-docs/ApiDocumentationPage"
import { DashboardPage } from "@/features/dashboard/DashboardPage"
import { IngestPage } from "@/features/ingest/IngestPage"

const defaultUserId = (import.meta.env.VITE_DEFAULT_USER_ID ?? "").trim()
const defaultDashboardPath = defaultUserId
  ? `/dashboard?user_id=${encodeURIComponent(defaultUserId)}`
  : "/dashboard"

/**
 * Main application router. Every page renders inside the shared sidebar layout.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={defaultDashboardPath} replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "ingest",
        element: <IngestPage />,
      },
      {
        path: "api-docs",
        element: <ApiDocumentationPage />,
      },
    ],
  },
])
