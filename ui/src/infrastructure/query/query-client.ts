import { QueryClient } from "@tanstack/react-query"

import { ApiRequestError } from "@/infrastructure/http/api-request-error"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiRequestError && error.status >= 400 && error.status < 500) {
          return false
        }

        return failureCount < 1
      },
    },
  },
})

