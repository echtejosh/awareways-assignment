import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"

import { UserId } from "@/domain/common/value-objects/user-id"

export function useUserIdParam() {
  const [searchParams] = useSearchParams()
  const userId = searchParams.get("user_id")?.trim() ?? ""
  const userIdObject = UserId.tryCreate(userId)

  return useMemo(
    () => ({
      userId,
      userIdObject,
      hasUserId: userId.length > 0,
      isValidUserId: userIdObject !== null,
    }),
    [userId, userIdObject]
  )
}
