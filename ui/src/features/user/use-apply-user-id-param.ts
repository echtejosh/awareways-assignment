import { useCallback } from "react"
import { useSearchParams } from "react-router-dom"

export function useApplyUserIdParam() {
  const [searchParams, setSearchParams] = useSearchParams()

  return useCallback(
    (userId: string) => {
      const nextParams = new URLSearchParams(searchParams)

      if (userId) {
        nextParams.set("user_id", userId)
      } else {
        nextParams.delete("user_id")
      }

      setSearchParams(nextParams)
    },
    [searchParams, setSearchParams]
  )
}
