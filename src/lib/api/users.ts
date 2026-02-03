import type { ServerTableParams, ServerTableResponse } from "@/components/data-table/types"
import type { User } from "@/types"

export async function fetchUsers(
  params: ServerTableParams
): Promise<ServerTableResponse<User>> {
  const searchParams = new URLSearchParams()
  searchParams.set("page", String(params.page))
  searchParams.set("limit", String(params.limit))
  if (params.search) searchParams.set("search", params.search)
  if (params.sort_by) {
    searchParams.set("sort_by", params.sort_by)
    searchParams.set("sort_order", params.sort_order)
  }
  if (params.filters.status != null && params.filters.status !== "")
    searchParams.set("filter_status", String(params.filters.status))
  if (params.filters.role != null && params.filters.role !== "")
    searchParams.set("filter_role", String(params.filters.role))

  const res = await fetch(`/api/users?${searchParams.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch users")
  return res.json()
}
